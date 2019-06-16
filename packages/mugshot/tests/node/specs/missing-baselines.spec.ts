import { describe, expect, it, beforeEach, afterEach } from '../../../../../tests/node/suite';
import { AssertionError } from 'chai';
import Mugshot, {
  MugshotMissingBaselineError, MugshotResult
} from '../../../src/lib/mugshot';
import PNGDiffer from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import { blackPixelBuffer } from '../../../../../tests/node/fixtures';
import Screenshotter from '../../../src/interfaces/screenshotter';
import XMock from '../xmock';

describe('Mugshot', () => {
  describe('missing baselines', () => {
    const fs = new XMock<FileSystem>();
    const browser = new XMock<Browser>();
    const pngDiffer = new XMock<PNGDiffer>();
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

    function setupFsWithMissingBaseline(path: string) {
      fs
        .when(f => f.pathExists(path))
        .returns(Promise.resolve(false));
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

    async function expectError<E extends Error>(
      checkCall: Promise<MugshotResult>,
      expectedError: new (...args: any) => E,
      runExpectations: (error: E) => void
    ) {
      let threwExpectedError = 0;

      try {
        await checkCall;
      } catch (error) {
        if (error instanceof expectedError) {
          threwExpectedError = 1;

          runExpectations(error);
        } else {
          throw error;
        }
      }

      if (!threwExpectedError) {
        throw new AssertionError(`Expected Mugshot to throw a ${expectedError.constructor.name} error`);
      }
    }

    async function expectMissingBaselineError(
      checkCall: Promise<MugshotResult>
    ) {
      return expectError(
        checkCall,
        MugshotMissingBaselineError,
        error => {
          expect(error.message).to.contain('Missing baseline');
        }
      );
    }

    it('should fail', async () => {
      setupFsWithMissingBaseline(
        'results/missing.png',
      );

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object,
        createMissingBaselines: false
      });

      await expectMissingBaselineError(
        mugshot.check('missing')
      );
    });

    it('should write missing baseline and pass', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupFsWithMissingBaseline('results/missing.png',);
      fs
        .when(f => f.outputFile('results/missing.png', blackPixelBuffer))
        .returns(Promise.resolve());

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        blackPixelBuffer
      );
    });

    it('should ignore an element', async () => {
      setupFsWithMissingBaseline(
        'results/ignore.png'
      );
      fs
        .when(f => f.outputFile('results/ignore.png', blackPixelBuffer))
        .returns(Promise.resolve());

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .returns(Promise.resolve(blackPixelBuffer));

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('ignore', { ignore: '.ignore' }),
        'results/ignore.png',
        blackPixelBuffer
      );
    });

    it('should screenshot only an element', async () => {
      setupFsWithMissingBaseline(
        'results/element.png'
      );
      fs
        .when(f => f.outputFile('results/element.png', blackPixelBuffer))
        .returns(Promise.resolve());

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .returns(Promise.resolve(blackPixelBuffer));

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        screenshotter: screenshotter.object,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        blackPixelBuffer
      );
    });
  });
});
