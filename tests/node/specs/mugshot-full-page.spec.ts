import { afterEach, beforeEach, describe, it } from '../suite';
import { It, Times } from 'typemoq';
import Mugshot from '../../../src/mugshot';
import {
  blackPixelB64,
  blackPixelBuffer,
  blackWhiteDiffBuffer,
  whitePixelBuffer
} from '../fixtures';
import {
  browserMock,
  fsMock,
  pngDifferMock,
  setupBrowserWithScreenshot,
  setupDifferWithResult,
  setupFsWithExistingBaseline,
  setupFsWithMissingBaseline,
  expectDiffResult,
  expectIdenticalResult,
  expectMissingBaselineError
} from '../mocks';

describe('Mugshot', () => {
  describe('Full page screenshots', () => {
    beforeEach(() => {
      fsMock.reset();
      browserMock.reset();
      pngDifferMock.reset();
    });

    afterEach(() => {
      browserMock.verifyAll();
      fsMock.verifyAll();
      pngDifferMock.verifyAll();
    });

    it('should pass for an existing identical screenshot', async () => {
      setupBrowserWithScreenshot(blackPixelB64);
      setupFsWithExistingBaseline(
        'results/existing-identical.png',
        blackPixelBuffer
      );
      setupDifferWithResult(
        blackPixelBuffer,
        blackPixelBuffer,
        { matches: true }
      );

      const mugshot = new Mugshot(browserMock.object, 'results', {
        fs: fsMock.object,
        pngDiffer: pngDifferMock.object
      });

      await expectIdenticalResult(
        mugshot.check('existing-identical'),
        'results/existing-identical.png',
        blackPixelBuffer
      );
    });

    it('should fail and create diff', async () => {
      setupBrowserWithScreenshot(blackPixelB64);

      setupFsWithExistingBaseline(
        'results/existing-diff.png',
        whitePixelBuffer
      );
      fsMock
        .setup(f => f.outputFile('results/existing-diff.diff.png', blackWhiteDiffBuffer))
        .returns(() => Promise.resolve())
        .verifiable();

      setupDifferWithResult(
        whitePixelBuffer,
        blackPixelBuffer,
        { matches: false, diff: blackWhiteDiffBuffer }
      );

      const mugshot = new Mugshot(browserMock.object, 'results', {
        fs: fsMock.object,
        pngDiffer: pngDifferMock.object
      });

      await expectDiffResult(
        mugshot.check('existing-diff'),
        'results/existing-diff.diff.png', blackWhiteDiffBuffer,
        'results/existing-diff.new.png', blackPixelBuffer
      );
    });

    it('should fail for a missing baseline', async () => {
      browserMock.setup(b => b.takeScreenshot()).verifiable(Times.never());

      pngDifferMock.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

      setupFsWithMissingBaseline(
        'results/missing.png',
      );

      const mugshot = new Mugshot(browserMock.object, 'results', {
        fs: fsMock.object,
        pngDiffer: pngDifferMock.object,
        createBaselines: false
      });

      await expectMissingBaselineError(
        mugshot.check('missing')
      );
    });

    it('should write missing baseline and pass', async () => {
      pngDifferMock.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

      setupBrowserWithScreenshot(blackPixelB64);

      setupFsWithMissingBaseline('results/missing.png',);

      fsMock
        .setup(f => f.outputFile('results/missing.png', blackPixelBuffer))
        .returns(() => Promise.resolve())
        .verifiable();

      const mugshot = new Mugshot(browserMock.object, 'results', {
        fs: fsMock.object,
        pngDiffer: pngDifferMock.object,
        createBaselines: true
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        blackPixelBuffer
      );
    });
  });
});
