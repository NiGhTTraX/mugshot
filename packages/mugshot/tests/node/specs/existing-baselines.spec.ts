import { describe, expect, it, beforeEach, afterEach } from '../../../../../tests/node/suite';
import { AssertionError } from 'chai';
import { Mock } from 'typemoq';
import Mugshot, {
  MugshotResult
} from '../../../src/lib/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import { blackPixelBuffer, redPixelBuffer, whitePixelBuffer } from '../../../../../tests/node/fixtures';
import Screenshotter from '../../../src/interfaces/screenshotter';
import XMock from '../xmock';

describe('Mugshot', () => {
  describe('existing baselines', () => {
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

    async function expectDiffResult(
      checkCall: Promise<MugshotResult>,
      diffPath: string,
      diff: Buffer,
      actualPath: string,
      actual: Buffer
    ) {
      const result = await checkCall;

      if (!result.matches) {
        expect(result.diffPath).to.equal(diffPath);
        expect(result.diff).to.deep.equal(diff);
        expect(result.actualPath).to.equal(actualPath);
        expect(result.actual).to.deep.equal(actual);
      } else {
        throw new AssertionError('Expected Mugshot to return a diff result');
      }
    }
    it('should pass when identical', async () => {
      setupFsWithExistingBaseline(
        'results/identical.png',
        blackPixelBuffer
      );

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(
        blackPixelBuffer,
        blackPixelBuffer,
        { matches: true }
      );

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object
      });

      await expectIdenticalResult(
        mugshot.check('identical'),
        'results/identical.png',
        blackPixelBuffer
      );
    });

    it('should fail and create diff for an unexpected change', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupFsWithExistingBaseline(
        'results/unexpected.png',
        whitePixelBuffer
      );
      fs
        .setup(f => f.outputFile('results/unexpected.diff.png', redPixelBuffer))
        .returns(() => Promise.resolve())
        .verifiable();

      setupDifferWithResult(
        whitePixelBuffer,
        blackPixelBuffer,
        { matches: false, diff: redPixelBuffer }
      );

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object
      });

      await expectDiffResult(
        mugshot.check('unexpected'),
        'results/unexpected.diff.png', redPixelBuffer,
        'results/unexpected.new.png', blackPixelBuffer
      );
    });

    it('should ignore an element', async () => {
      setupFsWithExistingBaseline(
        'results/ignore.png',
        blackPixelBuffer
      );

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(
        blackPixelBuffer,
        blackPixelBuffer,
        { matches: true }
      );

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object
      });

      await expectIdenticalResult(
        mugshot.check('ignore', { ignore: '.ignore' }),
        'results/ignore.png',
        blackPixelBuffer
      );
    });

    it('should screenshot only an element', async () => {
      setupFsWithExistingBaseline(
        'results/element.png',
        blackPixelBuffer
      );
      setupDifferWithResult(
        blackPixelBuffer,
        whitePixelBuffer,
        { matches: true }
      );

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        blackPixelBuffer
      );
    });
  });
});
