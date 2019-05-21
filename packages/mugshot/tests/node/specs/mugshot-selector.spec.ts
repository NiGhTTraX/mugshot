import { describe, expect, it, beforeEach, afterEach } from '../../../../../tests/node/suite';
import { Mock } from 'typemoq';
import Mugshot, {
  MugshotResult
} from '../../../src/lib/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import { blackPixelB64, blackPixelBuffer, whitePixelBuffer } from '../../../../../tests/node/fixtures';
import PNGProcessor from '../../../src/interfaces/png-processor';

describe('Mugshot', () => {
  describe('Selector screenshots', () => {
    const fs = Mock.ofType<FileSystem>();
    const browser = Mock.ofType<Browser>();
    const pngDiffer = Mock.ofType<PNGDiffer>();

    beforeEach(() => {
      fs.reset();
      browser.reset();
      pngDiffer.reset();
    });

    afterEach(() => {
      browser.verifyAll();
      fs.verifyAll();
      pngDiffer.verifyAll();
    });

    // TODO: dedupe these
    function setupFsWithExistingBaseline(path: string, base: Buffer) {
      fs
        .setup(f => f.pathExists(path))
        .returns(() => Promise.resolve(true))
        .verifiable();
      fs
        .setup(f => f.readFile(path))
        .returns(() => Promise.resolve(base))
        .verifiable();
    }

    function setupBrowserWithScreenshot(base64: string) {
      browser
        .setup(b => b.takeScreenshot())
        .returns(() => Promise.resolve(base64))
        .verifiable();
    }

    function setupDifferWithResult(base: Buffer, screenshot: Buffer, result: DiffResult) {
      pngDiffer
        .setup(e => e.compare(base, screenshot))
        .returns(() => Promise.resolve(result))
        .verifiable();
    }

    async function expectIdenticalResult(
      checkCall: Promise<MugshotResult>,
      baselinePath: string,
      baseline: Buffer
    ) {
      const result = await checkCall;

      expect(result.matches).to.be.true;
      expect(result.baselinePath).to.equal(baselinePath);
      expect(result.baseline).to.deep.equal(baseline);
    }

    it('should crop the full page screenshot to the element\'s rect and compare it to existing baseline', async () => {
      setupBrowserWithScreenshot(blackPixelB64);
      setupFsWithExistingBaseline(
        'results/existing-identical.png',
        blackPixelBuffer
      );
      setupDifferWithResult(
        blackPixelBuffer,
        whitePixelBuffer,
        { matches: true }
      );

      browser
        .setup(b => b.getElementRect('.test'))
        .returns(() => Promise.resolve({ x: 10, y: 10, width: 100, height: 100 }))
        .verifiable();

      const pngProcessor = Mock.ofType<PNGProcessor>();
      pngProcessor
        .setup(p => p.crop(blackPixelBuffer, 10, 10, 100, 100))
        .returns(() => Promise.resolve(whitePixelBuffer))
        .verifiable();

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        pngProcessor: pngProcessor.object
      });

      await expectIdenticalResult(
        mugshot.check('existing-identical', '.test'),
        'results/existing-identical.png',
        blackPixelBuffer
      );
    });
  });
});
