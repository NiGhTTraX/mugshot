import { describe, expect, it, beforeEach, afterEach } from '../../../../../tests/node/suite';
import { AssertionError } from 'chai';
import { It, Mock, Times } from 'typemoq';
import Mugshot, {
  MugshotMissingBaselineError, MugshotResult
} from '../../../src/lib/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import { blackPixelBuffer, redPixelBuffer, whitePixelBuffer } from '../../../../../tests/node/fixtures';
import { Screenshotter } from '../../../src/interfaces/screenshotter';
import XMock from '../xmock';

describe('Mugshot', () => {
  describe('Full page screenshots', () => {
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

    function setupFsWithMissingBaseline(path: string) {
      fs
        .setup(f => f.pathExists(path))
        .returns(() => Promise.resolve(false))
        .verifiable();
      fs
        .setup(f => f.readFile(path))
        .verifiable(Times.never());
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

    it('should pass for an existing identical screenshot', async () => {
      setupFsWithExistingBaseline(
        'results/existing-identical.png',
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
        mugshot.check('existing-identical'),
        'results/existing-identical.png',
        blackPixelBuffer
      );
    });

    it('should fail and create diff', async () => {
      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupFsWithExistingBaseline(
        'results/existing-diff.png',
        whitePixelBuffer
      );
      fs
        .setup(f => f.outputFile('results/existing-diff.diff.png', redPixelBuffer))
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
        mugshot.check('existing-diff'),
        'results/existing-diff.diff.png', redPixelBuffer,
        'results/existing-diff.new.png', blackPixelBuffer
      );
    });

    it('should fail for a missing baseline', async () => {
      browser.setup(b => b.takeScreenshot()).verifiable(Times.never());

      pngDiffer.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

      setupFsWithMissingBaseline(
        'results/missing.png',
      );

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        createMissingBaselines: false,
        screenshotter: screenshotter.object
      });

      await expectMissingBaselineError(
        mugshot.check('missing')
      );
    });

    it('should write missing baseline and pass', async () => {
      pngDiffer.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

      screenshotter
        .when(s => s.takeScreenshot({}))
        .returns(Promise.resolve(blackPixelBuffer));

      setupFsWithMissingBaseline('results/missing.png',);

      fs
        .setup(f => f.outputFile('results/missing.png', blackPixelBuffer))
        .returns(() => Promise.resolve())
        .verifiable();

      const mugshot = new Mugshot(browser.object, 'results', {
        fs: fs.object,
        pngDiffer: pngDiffer.object,
        createMissingBaselines: true,
        screenshotter: screenshotter.object
      });

      await expectIdenticalResult(
        mugshot.check('missing'),
        'results/missing.png',
        blackPixelBuffer
      );
    });

    it('should ignore an element with existing baseline', async () => {
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

    it('should ignore an element with missing baseline', async () => {
      setupFsWithMissingBaseline(
        'results/ignore.png'
      );

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
  });
});
