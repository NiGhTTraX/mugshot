import { AssertionError } from 'chai';
import { instance, It, mock, reset, verify, when } from 'strong-mock';
import { expect } from 'tdd-buffet/expect/jest';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import {
  blackPixelBuffer,
  redPixelBuffer,
  whitePixelBuffer,
} from '../fixtures';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import ScreenshotStorage from '../../../src/interfaces/screenshot-storage';
import Screenshotter from '../../../src/interfaces/screenshotter';
import Mugshot, {
  MugshotMissingBaselineError,
  MugshotResult,
} from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  const storage = mock<ScreenshotStorage>();
  const pngDiffer = mock<PNGDiffer>();
  const screenshotter = mock<Screenshotter>();

  async function expectIdenticalResult(
    checkCall: Promise<MugshotResult>,
    baselinePath: string,
    name: string,
    baseline: Buffer
  ) {
    const result = await checkCall;

    expect(result.matches).toBeTruthy();
    expect(result.expectedName).toEqual(name);
    expect(result.expected).toEqual(baseline);
  }

  function ignoreCleanup() {
    when(storage.delete(It.isAny())).thenResolve(undefined).atLeast(0);
  }

  beforeEach(() => {
    reset(storage);
    reset(screenshotter);
    reset(pngDiffer);
  });

  afterEach(() => {
    verify(storage);
    verify(screenshotter);
    verify(pngDiffer);
  });

  describe('existing baselines', () => {
    function setupStorageWithExistingBaseline(name: string, base: Buffer) {
      when(storage.exists(name)).thenResolve(true);
      when(storage.read(name)).thenResolve(base);

      return storage;
    }

    function setupDifferWithResult(
      base: Buffer,
      screenshot: Buffer,
      result: DiffResult
    ) {
      when(pngDiffer.compare(base, screenshot)).thenResolve(result);
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
        expect(result.diffName).toEqual(diffName);
        expect(result.diff).toEqual(diff);
        expect(result.actualName).toEqual(actualName);
        expect(result.actual).toEqual(actual);
      } else {
        throw new AssertionError('Expected Mugshot to return a diff result');
      }
    }

    it('should pass when identical', async () => {
      setupStorageWithExistingBaseline('identical', blackPixelBuffer);
      ignoreCleanup();

      when(screenshotter.takeScreenshot({})).thenResolve(blackPixelBuffer);

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true,
      });

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
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
      when(storage.delete('identical.diff')).thenResolve(undefined);
      when(storage.delete('identical.actual')).thenResolve(undefined);

      when(screenshotter.takeScreenshot({})).thenResolve(blackPixelBuffer);

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true,
      });

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
      });

      await mugshot.check('identical');
    });

    it('should fail and create diff for an unexpected change', async () => {
      when(screenshotter.takeScreenshot({})).thenResolve(blackPixelBuffer);

      setupStorageWithExistingBaseline('unexpected', whitePixelBuffer);
      when(storage.write('unexpected.actual', blackPixelBuffer)).thenResolve(
        undefined
      );
      when(storage.write('unexpected.diff', redPixelBuffer)).thenResolve(
        undefined
      );

      setupDifferWithResult(whitePixelBuffer, blackPixelBuffer, {
        matches: false,
        diff: redPixelBuffer,
        percentage: 1,
      });

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
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

      when(screenshotter.takeScreenshot({ ignore: '.ignore' })).thenResolve(
        blackPixelBuffer
      );

      setupDifferWithResult(blackPixelBuffer, blackPixelBuffer, {
        matches: true,
      });

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
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
        matches: true,
      });

      when(screenshotter.takeScreenshot('.element', {})).thenResolve(
        whitePixelBuffer
      );

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        'element',
        blackPixelBuffer
      );
    });

    it('should screenshot only an area', async () => {
      setupStorageWithExistingBaseline('element', blackPixelBuffer);
      ignoreCleanup();

      setupDifferWithResult(blackPixelBuffer, whitePixelBuffer, {
        matches: true,
      });

      when(
        screenshotter.takeScreenshot({ x: 0, y: 1, width: 2, height: 3 }, {})
      ).thenResolve(whitePixelBuffer);

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
      });

      await expectIdenticalResult(
        mugshot.check('element', { x: 0, y: 1, width: 2, height: 3 }),
        'results/element.png',
        'element',
        blackPixelBuffer
      );
    });

    it('should update when told to', async () => {
      when(storage.exists('update')).thenResolve(true);
      when(storage.write('update', whitePixelBuffer)).thenResolve(undefined);
      ignoreCleanup();

      when(screenshotter.takeScreenshot({})).thenResolve(whitePixelBuffer);

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        updateBaselines: true,
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
      when(storage.exists(name)).thenResolve(false);
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
      return expectError(checkCall, MugshotMissingBaselineError, (error) => {
        expect(error.message).toContain('Missing baseline');
      });
    }

    it('should fail when told to not create', async () => {
      setupStorageWithMissingBaseline('missing');

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        createMissingBaselines: false,
      });

      await expectMissingBaselineError(mugshot.check('missing'));
    });

    it('should write missing baseline and pass when told to create', async () => {
      when(screenshotter.takeScreenshot({})).thenResolve(blackPixelBuffer);

      setupStorageWithMissingBaseline('missing');
      when(storage.write('missing', blackPixelBuffer)).thenResolve(undefined);
      ignoreCleanup();

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        createMissingBaselines: true,
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        'missing',
        blackPixelBuffer
      );
    });

    it('should remove leftover artifacts', async () => {
      when(screenshotter.takeScreenshot({})).thenResolve(blackPixelBuffer);

      setupStorageWithMissingBaseline('missing');
      when(storage.write('missing', blackPixelBuffer)).thenResolve(undefined);
      when(storage.delete('missing.diff')).thenResolve(undefined);
      when(storage.delete('missing.actual')).thenResolve(undefined);

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        createMissingBaselines: true,
      });

      await mugshot.check('missing');
    });

    it('should ignore an element when told to create', async () => {
      setupStorageWithMissingBaseline('ignore');
      when(storage.write('ignore', blackPixelBuffer)).thenResolve(undefined);
      ignoreCleanup();

      when(screenshotter.takeScreenshot({ ignore: '.ignore' })).thenResolve(
        blackPixelBuffer
      );

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        createMissingBaselines: true,
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
      when(storage.write('element', blackPixelBuffer)).thenResolve(undefined);
      ignoreCleanup();

      when(screenshotter.takeScreenshot('.element', {})).thenResolve(
        blackPixelBuffer
      );

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        createMissingBaselines: true,
      });

      await expectIdenticalResult(
        mugshot.check('element', '.element'),
        'results/element.png',
        'element',
        blackPixelBuffer
      );
    });

    it('should write missing baseline and pass when told to update', async () => {
      when(screenshotter.takeScreenshot({})).thenResolve(blackPixelBuffer);

      setupStorageWithMissingBaseline('missing');
      when(storage.write('missing', blackPixelBuffer)).thenResolve(undefined);
      ignoreCleanup();

      const mugshot = new Mugshot(instance(screenshotter), instance(storage), {
        pngDiffer: instance(pngDiffer),
        createMissingBaselines: false,
        updateBaselines: true,
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
