import { describe, expect, it, beforeEach, afterEach } from '../suite';
import { AssertionError } from 'chai';
import { It, Mock, Times } from 'typemoq';
import Mugshot, { MugshotDiffError, MugshotIdenticalResult } from '../../../src/mugshot';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import Browser from '../../../src/interfaces/browser';
import FileSystem from '../../../src/interfaces/file-system';
import { blackPixelB64, blackPixelBuffer, blackWhiteDiffBuffer, whitePixelBuffer } from '../fixtures';

describe('Mugshot', () => {
  const fs = Mock.ofType<FileSystem>();
  const browser = Mock.ofType<Browser>();
  const pngDiffer = Mock.ofType<PNGDiffer>();

  beforeEach(() => {
    fs.reset();
    browser.reset();
    pngDiffer.reset();
  });

  afterEach(() => {
    browser.verifyAll();
    fs.verifyAll();
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

  function setupBrowserWithScreenshot(base64: string) {
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(base64))
      .verifiable();
  }

  function setupDifferWithResult(base: Buffer, screenshot: Buffer, result: DiffResult) {
    pngDiffer
      .setup(e => e.compare(base, screenshot))
      .returns(() => Promise.resolve(result))
      .verifiable();
  }

  async function expectError(
    checkCall: Promise<MugshotIdenticalResult>,
    message: string, diff?: Buffer
  ) {
    let diffError = 0;

    try {
      await checkCall;
    } catch (result) {
      if (result instanceof MugshotDiffError) {
        diffError = 1;

        expect(result.message).to.contain(message);
        expect(result.diff).to.deep.equal(diff);
      } else {
        throw result;
      }
    }

    if (!diffError) {
      throw new AssertionError('Expected Mugshot to throw a diff error');
    }
  }

  async function expectSuccess(
    checkCall: Promise<MugshotIdenticalResult>,
    baselinePath: string,
    baseline: Buffer
  ) {
    const result = await checkCall;

    expect(result.baselinePath).to.equal(baselinePath);
    expect(result.baseline).to.deep.equal(baseline);
  }

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

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngDiffer.object
    });

    await expectSuccess(
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
    fs
      .setup(f => f.outputFile('results/existing-diff.diff.png', blackWhiteDiffBuffer))
      .returns(() => Promise.resolve())
      .verifiable();

    setupDifferWithResult(
      whitePixelBuffer,
      blackPixelBuffer,
      { matches: false, diff: blackWhiteDiffBuffer }
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngDiffer.object
    });

    await expectError(
      mugshot.check('existing-diff'),
      'Visual changes detected',
      blackWhiteDiffBuffer
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
      createBaselines: false
    });

    await expectError(
      mugshot.check('missing'),
      'Missing baseline'
    );
  });

  it('should write missing baseline and pass', async () => {
    pngDiffer.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

    setupBrowserWithScreenshot(blackPixelB64);

    setupFsWithMissingBaseline('results/missing.png',);

    fs
      .setup(f => f.outputFile('results/missing.png', blackPixelBuffer))
      .returns(() => Promise.resolve())
      .verifiable();

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngDiffer.object,
      createBaselines: true
    });

    await expectSuccess(
      mugshot.check('missing'),
      'results/missing.png',
      blackPixelBuffer
    );
  });
});
