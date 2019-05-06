import { afterEach, beforeEach, describe, it } from '../suite';
import Mugshot from '../../../src/mugshot';
import { blackPixelB64, blackPixelBuffer } from '../fixtures';
import {
  browserMock,
  fsMock,
  pngDifferMock,
  setupBrowserWithScreenshot,
  setupDifferWithResult,
  setupFsWithExistingBaseline,
  expectIdenticalResult
} from '../mocks';

describe('Mugshot', () => {
  describe('Selector screenshots', () => {
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
      setupBrowserWithScreenshot(blackPixelB64, '#root');
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
        mugshot.check('existing-identical', '#root'),
        'results/existing-identical.png',
        blackPixelBuffer
      );
    });
  });
});
