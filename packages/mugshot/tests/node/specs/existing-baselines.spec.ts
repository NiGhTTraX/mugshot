import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { expect } from 'tdd-buffet/suite/expect';
import { AssertionError } from 'chai';
import Mugshot, { MugshotResult } from '../../../src/lib/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import ScreenshotStorage from '../../../src/interfaces/screenshot-storage';
import {
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer
} from '../../../../../tests/node/fixtures';
import Screenshotter from '../../../src/interfaces/screenshotter';
import Mock from 'strong-mock';

describe('Mugshot', () => {
  describe('existing baselines', () => {
    const storage = new Mock<ScreenshotStorage>();
    const browser = new Mock<Browser>();
    const pngDiffer = new Mock<PNGDiffer>();
    const screenshotter = new Mock<Screenshotter>();

    beforeEach(() => {
      storage.reset();
      browser.reset();
      screenshotter.reset();
      pngDiffer.reset();
    });

    afterEach(() => {
      storage.verifyAll();
      browser.verifyAll();
      screenshotter.verifyAll();
      pngDiffer.verifyAll();
    });

    function setupStorageWithExistingBaseline(name: string, base: Buffer) {
      storage
        .when(s => s.pathExists(name))
        .returns(Promise.resolve(true));
      storage
        .when(f => f.readFile(name))
        .returns(Promise.resolve(base));

      return storage;
    }

    function setupDifferWithResult(base: Buffer, screenshot: Buffer, result: DiffResult) {
      pngDiffer
        .when(e => e.compare(base, screenshot))
        .returns(Promise.resolve(result));
    }

    async function expectIdenticalResult(
      checkCall: Promise<MugshotResult>,
      baselinePath: string,
      name: string,
      baseline: Buffer
    ) {
      const result = await checkCall;

      expect(result.matches).to.be.true;
      expect(result.expectedName).to.equal(name);
      expect(result.expected).to.deep.equal(baseline);
    }

    async function expectDiffResult(
      checkCall: Promise<MugshotResult>,
      diffName: string,
      diff: Buffer,
      actualName: string,
      actual: Buffer
    ) {
      const result = await checkCall;

      if (!result.matches) {
        expect(result.diffName).to.equal(diffName);
        expect(result.diff).to.deep.equal(diff);
        expect(result.actualName).to.equal(actualName);
        expect(result.actual).to.deep.equal(actual);
      } else {
        throw new AssertionError('Expected Mugshot to return a diff result');
      }
    }

    it('should pass when identical', async () => {
      setupStorageWithExistingBaseline('identical', blackPixelBuffer);

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(
        blackPixelBuffer,
        blackPixelBuffer,
        { matches: true }
      );

      const mugshot = new Mugshot(browser.stub, 'results', {
        storage: storage.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
      });

      await expectIdenticalResult(
        mugshot.check('identical'),
        'results/identical.png',
        'identical',
        blackPixelBuffer
      );
    });

    it('should fail and create diff for an unexpected change', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupStorageWithExistingBaseline('unexpected', whitePixelBuffer);
      storage
        .when(f => f.outputFile('unexpected.actual', blackPixelBuffer))
        .returns(Promise.resolve());
      storage
        .when(f => f.outputFile('unexpected.diff', redPixelBuffer))
        .returns(Promise.resolve());

      setupDifferWithResult(
        whitePixelBuffer,
        blackPixelBuffer,
        { matches: false, diff: redPixelBuffer }
      );

      const mugshot = new Mugshot(browser.stub, 'results', {
        storage: storage.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
      });

      await expectDiffResult(
        mugshot.check('unexpected'),
        'unexpected.diff', redPixelBuffer,
        'unexpected.actual', blackPixelBuffer
      );
    });

    it('should ignore an element', async () => {
      setupStorageWithExistingBaseline('ignore', blackPixelBuffer);

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(
        blackPixelBuffer,
        blackPixelBuffer,
        { matches: true }
      );

      const mugshot = new Mugshot(browser.stub, 'results', {
        storage: storage.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
      });

      await expectIdenticalResult(
        mugshot.check('ignore', { ignore: '.ignore' }),
        'results/ignore.png',
        'ignore',
        blackPixelBuffer
      );
    });

    it('should screenshot only an element', async () => {
      setupStorageWithExistingBaseline('element', blackPixelBuffer);
      setupDifferWithResult(
        blackPixelBuffer,
        whitePixelBuffer,
        { matches: true }
      );

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(browser.stub, 'results', {
        storage: storage.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        'element',
        blackPixelBuffer
      );
    });

    it('should update when told to', async () => {
      storage
        .when(f => f.pathExists('update'))
        .returns(Promise.resolve(true));
      storage
        .when(f => f.outputFile('update', whitePixelBuffer))
        .returns(Promise.resolve());

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(browser.stub, 'results', {
        storage: storage.stub,
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        updateBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('update'),
        'results/update.png',
        'update',
        whitePixelBuffer
      );
    });
  });
});
