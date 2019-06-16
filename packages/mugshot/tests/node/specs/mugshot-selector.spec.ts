import { describe, expect, it, beforeEach, afterEach } from '../../../../../tests/node/suite';
import { Mock } from 'typemoq';
import Mugshot, {
  MugshotResult
} from '../../../src/lib/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import { blackPixelBuffer, whitePixelBuffer } from '../../../../../tests/node/fixtures';
import XMock from '../xmock';
import { Screenshotter } from '../../../src/interfaces/screenshotter';

describe('Mugshot', () => {
  describe('Selector screenshots', () => {
    const fs = Mock.ofType<FileSystem>();
    const browser = Mock.ofType<Browser>();
    const pngDiffer = Mock.ofType<PNGDiffer>();
    const screenshotter = new XMock<Screenshotter>();

    beforeEach(() => {
      fs.reset();
      browser.reset();
      screenshotter.reset();
      pngDiffer.reset();
    });

    afterEach(() => {
      fs.verifyAll();
      browser.verifyAll();
      screenshotter.verifyAll();
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
      setupFsWithExistingBaseline(
        'results/existing-identical.png',
        blackPixelBuffer
      );
      setupDifferWithResult(
        blackPixelBuffer,
        whitePixelBuffer,
        { matches: true }
      );

      screenshotter
        .when(s => s.takeScreenshot('.test', {}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object
      });

      await expectIdenticalResult(
        mugshot.check('existing-identical', '.test'),
        'results/existing-identical.png',
        blackPixelBuffer
      );
    });
  });
});
