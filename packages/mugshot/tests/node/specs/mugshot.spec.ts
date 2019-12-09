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
      storage.when(s => s.exists(name)).resolves(true);
      storage.when(f => f.read(name)).resolves(base);

      return storage;
    }

    function setupDifferWithResult(
      base: Buffer,
      screenshot: Buffer,
      result: DiffResult
    ) {
      pngDiffer.when(e => e.compare(base, screenshot)).resolves(result);
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

      screenshotter.when(s => s.takeScreenshot({})).resolves(blackPixelBuffer);

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

      screenshotter.when(s => s.takeScreenshot({})).resolves(blackPixelBuffer);

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true
      });

      const mugshot = new Mugshot(screenshotter.stub, storage.stub, {
        pngDiffer: pngDiffer.stub
      });

      await mugshot.check('identical');
    });

    it('should fail and create diff for an unexpected change', async () => {
      screenshotter.when(s => s.takeScreenshot({})).resolves(blackPixelBuffer);

      setupStorageWithExistingBaseline('unexpected', whitePixelBuffer);
      storage
        .when(f => f.write('unexpected.actual', blackPixelBuffer))
        .resolves(undefined);
      storage
        .when(f => f.write('unexpected.diff', redPixelBuffer))
        .resolves(undefined);

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
        .resolves(blackPixelBuffer);

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
        .resolves(whitePixelBuffer);

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
      storage.when(f => f.exists('update')).resolves(true);
      storage
        .when(f => f.write('update', whitePixelBuffer))
        .resolves(undefined);
      ignoreCleanup();

      screenshotter.when(s => s.takeScreenshot({})).resolves(whitePixelBuffer);

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
      storage.when(f => f.exists(name)).resolves(false);
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
      screenshotter.when(s => s.takeScreenshot({})).resolves(blackPixelBuffer);

      setupStorageWithMissingBaseline('missing');
      storage
        .when(f => f.write('missing', blackPixelBuffer))
        .resolves(undefined);
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
      screenshotter.when(s => s.takeScreenshot({})).resolves(blackPixelBuffer);

      setupStorageWithMissingBaseline('missing');
      storage
        .when(f => f.write('missing', blackPixelBuffer))
        .resolves(undefined);
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
        .resolves(undefined);
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot({ ignore: '.ignore' }))
        .resolves(blackPixelBuffer);

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
        .resolves(undefined);
      ignoreCleanup();

      screenshotter
        .when(s => s.takeScreenshot('.element', {}))
        .resolves(blackPixelBuffer);

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
      screenshotter.when(s => s.takeScreenshot({})).resolves(blackPixelBuffer);

      setupStorageWithMissingBaseline('missing');
      storage
        .when(f => f.write('missing', blackPixelBuffer))
        .resolves(undefined);
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
