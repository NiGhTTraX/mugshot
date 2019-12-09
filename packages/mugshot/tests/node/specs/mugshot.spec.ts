import { AssertionError } from 'chai';
import Mock, { It } from 'strong-mock';
import { expect } from 'tdd-buffet/expect/chai';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import {
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer
} from '../../../../../tests/node/fixtures';
import Browser from '../../../src/interfaces/browser';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import ScreenshotStorage from '../../../src/interfaces/screenshot-storage';
import Screenshotter from '../../../src/interfaces/screenshotter';
import Mugshot, {
  MugshotMissingBaselineError,
  MugshotResult
} from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  const storage = new Mock<ScreenshotStorage>();
  const browser = new Mock<Browser>();
  const pngDiffer = new Mock<PNGDiffer>();
  const screenshotter = new Mock<Screenshotter>();

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

  function ignoreCleanup() {
    storage
      .when(s => s.delete(It.isAny))
      .resolves(undefined)
      .always();
  }

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

  describe('existing baselines', () => {
    function setupStorageWithExistingBaseline(name: string, base: Buffer) {
      storage.when(s => s.exists(name)).returns(Promise.resolve(true));
      storage.when(f => f.read(name)).returns(Promise.resolve(base));

      return storage;
    }

    function setupDifferWithResult(
      base: Buffer,
      screenshot: Buffer,
      result: DiffResult
    ) {
      pngDiffer
        .when(e => e.compare(base, screenshot))
        .returns(Promise.resolve(result));
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
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true
      });

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub
      });

      await expectIdenticalResult(
        mugshot.check('identical'),
        'results/identical.png',
        'identical',
        blackPixelBuffer
      );
    });

    it('should remove leftover artifacts', async () => {
      setupStorageWithExistingBaseline('identical', blackPixelBuffer);
      storage.when(s => s.delete('identical.diff')).resolves(undefined);
      storage.when(s => s.delete('identical.actual')).resolves(undefined);

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true
      });

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub
      });

      await mugshot.check('identical');
    });

    it('should fail and create diff for an unexpected change', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupStorageWithExistingBaseline('unexpected', whitePixelBuffer);
      storage
        .when(f => f.write('unexpected.actual', blackPixelBuffer))
        .returns(Promise.resolve());
      storage
        .when(f => f.write('unexpected.diff', redPixelBuffer))
        .returns(Promise.resolve());

      setupDifferWithResult(whitePixelBuffer, blackPixelBuffer, {
        matches: false,
        diff: redPixelBuffer
      });

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub
      });

      await expectDiffResult(
        mugshot.check('unexpected'),
        'unexpected.diff',
        redPixelBuffer,
        'unexpected.actual',
        blackPixelBuffer
      );
    });

    it('should ignore an element', async () => {
      setupStorageWithExistingBaseline('ignore', blackPixelBuffer);
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .returns(Promise.resolve(blackPixelBuffer));

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true
      });

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub
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
      ignoreCleanup();

      setupDifferWithResult(blackPixelBuffer, whitePixelBuffer, {
        matches: true
      });

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        'element',
        blackPixelBuffer
      );
    });

    it('should update when told to', async () => {
      storage.when(f => f.exists('update')).returns(Promise.resolve(true));
      storage
        .when(f => f.write('update', whitePixelBuffer))
        .returns(Promise.resolve());
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(whitePixelBuffer));

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
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

  describe('missing baselines', () => {
    function setupStorageWithMissingBaseline(name: string) {
      storage.when(f => f.exists(name)).returns(Promise.resolve(false));
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
        throw new AssertionError(
          `Expected Mugshot to throw a ${expectedError.constructor.name} error`
        );
      }
    }

    async function expectMissingBaselineError(
      checkCall: Promise<MugshotResult>
    ) {
      return expectError(checkCall, MugshotMissingBaselineError, error => {
        expect(error.message).to.contain('Missing baseline');
      });
    }

    it('should fail when told to not create', async () => {
      setupStorageWithMissingBaseline('missing');

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        createMissingBaselines: false
      });

      await expectMissingBaselineError(mugshot.check('missing'));
    });

    it('should write missing baseline and pass when told to create', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupStorageWithMissingBaseline('missing');
      storage
        .when(f => f.write('missing', blackPixelBuffer))
        .returns(Promise.resolve());
      ignoreCleanup();

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        createMissingBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        'missing',
        blackPixelBuffer
      );
    });

    it('should remove leftover artifacts', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupStorageWithMissingBaseline('missing');
      storage
        .when(f => f.write('missing', blackPixelBuffer))
        .returns(Promise.resolve());
      storage.when(s => s.delete('missing.diff')).resolves(undefined);
      storage.when(s => s.delete('missing.actual')).resolves(undefined);

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
        createMissingBaselines: true
      });

      await mugshot.check('missing');
    });

    it('should ignore an element when told to create', async () => {
      setupStorageWithMissingBaseline('ignore');
      storage
        .when(f => f.write('ignore', blackPixelBuffer))
        .returns(Promise.resolve());
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .returns(Promise.resolve(blackPixelBuffer));

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
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
        .when(f => f.write('element', blackPixelBuffer))
        .returns(Promise.resolve());
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .returns(Promise.resolve(blackPixelBuffer));

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
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

      setupStorageWithMissingBaseline('missing');
      storage
        .when(f => f.write('missing', blackPixelBuffer))
        .returns(Promise.resolve());
      ignoreCleanup();

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub,
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
