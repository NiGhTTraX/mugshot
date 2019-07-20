import { afterEach, beforeEach, describe, expect, it } from 'tdd-buffet/suite/node';
import { AssertionError } from 'chai';
import Mugshot, { MugshotResult } from '../../../src/lib/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import {
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer
} from '../../../../../tests/node/fixtures';
import Screenshotter from '../../../src/interfaces/screenshotter';
import Mock from 'strong-mock';

describe('Mugshot', () => {
  describe('existing baselines', () => {
    const fs = new Mock<FileSystem>();
    const browser = new Mock<Browser>();
    const pngDiffer = new Mock<PNGDiffer>();
    const screenshotter = new Mock<Screenshotter>();

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
        .when(f => f.pathExists(path))
        .returns(Promise.resolve(true));
      fs
        .when(f => f.readFile(path))
        .returns(Promise.resolve(base));
    }

    function setupDifferWithResult(base: Buffer, screenshot: Buffer, result: DiffResult) {
      pngDiffer
        .when(e => e.compare(base, screenshot))
        .returns(Promise.resolve(result));
    }

    async function expectIdenticalResult(
      checkCall: Promise<MugshotResult>,
      baselinePath: string,
      baseline: Buffer
    ) {
      const result = await checkCall;

      expect(result.matches).to.be.true;
      expect(result.expectedPath).to.equal(baselinePath);
      expect(result.expected).to.deep.equal(baseline);
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

      const mugshot = new Mugshot(browser.stub, 'results', {
        fs: fs.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
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
        .when(f => f.outputFile('results/unexpected.actual.png', blackPixelBuffer))
        .returns(Promise.resolve());
      fs
        .when(f => f.outputFile('results/unexpected.diff.png', redPixelBuffer))
        .returns(Promise.resolve());

      setupDifferWithResult(
        whitePixelBuffer,
        blackPixelBuffer,
        { matches: false, diff: redPixelBuffer }
      );

      const mugshot = new Mugshot(browser.stub, 'results', {
        fs: fs.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
      });

      await expectDiffResult(
        mugshot.check('unexpected'),
        'results/unexpected.diff.png', redPixelBuffer,
        'results/unexpected.actual.png', blackPixelBuffer
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

      const mugshot = new Mugshot(browser.stub, 'results', {
        fs: fs.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
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

      const mugshot = new Mugshot(browser.stub, 'results', {
        fs: fs.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        blackPixelBuffer
      );
    });

    it('should update when told to', async () => {
      fs
        .when(f => f.pathExists('results/update.png'))
        .returns(Promise.resolve(true));
      fs
        .when(f => f.outputFile('results/update.png', whitePixelBuffer))
        .returns(Promise.resolve());

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(browser.stub, 'results', {
        fs: fs.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        updateBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('update'),
        'results/update.png',
        whitePixelBuffer
      );
    });
  });
});
