import { AssertionError } from 'chai';
import Mock from 'strong-mock';
import { expect } from 'tdd-buffet/suite/expect';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { blackPixelBuffer } from '../../../../../tests/node/fixtures';
import Browser from '../../../src/interfaces/browser';
import PNGDiffer from '../../../src/interfaces/png-differ';
import ScreenshotStorage from '../../../src/interfaces/screenshot-storage';
import Screenshotter from '../../../src/interfaces/screenshotter';
import Mugshot, { MugshotMissingBaselineError, MugshotResult } from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  describe('missing baselines', () => {
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

    function setupStorageWithMissingBaseline(name: string) {
      storage
        .when(f => f.baselineExists(name))
        .returns(Promise.resolve(false));
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

    it('should fail when told to not create', async () => {
      setupStorageWithMissingBaseline('missing',);

      const mugshot = new Mugshot(browser.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        createMissingBaselines: false
      });

      await expectMissingBaselineError(
        mugshot.check('missing')
      );
    });

    it('should write missing baseline and pass when told to create', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupStorageWithMissingBaseline('missing',);
      storage
        .when(f => f.writeBaseline('missing', blackPixelBuffer))
        .returns(Promise.resolve());

      const mugshot = new Mugshot(browser.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        'missing',
        blackPixelBuffer
      );
    });

    it('should ignore an element when told to create', async () => {
      setupStorageWithMissingBaseline('ignore');
      storage
        .when(f => f.writeBaseline('ignore', blackPixelBuffer))
        .returns(Promise.resolve());

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .returns(Promise.resolve(blackPixelBuffer));

      const mugshot = new Mugshot(browser.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('ignore', { ignore: '.ignore' }),
        'results/ignore.png',
        'ignore',
        blackPixelBuffer
      );
    });

    it('should screenshot only an element when told to create', async () => {
      setupStorageWithMissingBaseline('element');
      storage
        .when(f => f.writeBaseline('element', blackPixelBuffer))
        .returns(Promise.resolve());

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .returns(Promise.resolve(blackPixelBuffer));

      const mugshot = new Mugshot(browser.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        'element',
        blackPixelBuffer
      );
    });

    it('should write missing baseline and pass when told to update', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupStorageWithMissingBaseline('missing',);
      storage
        .when(f => f.writeBaseline('missing', blackPixelBuffer))
        .returns(Promise.resolve());

      const mugshot = new Mugshot(browser.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        screenshotter: screenshotter.stub,
        createMissingBaselines: false,
        updateBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        'missing',
        blackPixelBuffer
      );
    });
  });
});
