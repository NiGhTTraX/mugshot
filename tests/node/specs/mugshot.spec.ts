import { describe, expect, it } from '../suite';
import { AssertionError } from 'chai';
import Mugshot, { Browser, FileSystem, VisualRegressionTester } from '../../../src/mugshot';
import { It, Mock, Times } from 'typemoq';
import PNGDiffer, { DiffResult } from '../../../src/interfaces/png-differ';
import { blackPixelB64, blackPixelBuffer, blackWhiteDiffBuffer, whitePixelBuffer } from '../fixtures';

describe('Mugshot', () => {
  function getFsWithExistingBaseline(path: string, base: Buffer) {
    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.pathExists(path))
      .returns(() => Promise.resolve(true))
      .verifiable();
    fs
      .setup(f => f.readFile(path))
      .returns(() => Promise.resolve(base))
      .verifiable();
    return fs;
  }

  function getFsWithMissingBaseline(path: string) {
    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.pathExists(path))
      .returns(() => Promise.resolve(false))
      .verifiable();
    fs
      .setup(f => f.readFile(path))
      .verifiable(Times.never());
    return fs;
  }

  function getBrowserWithScreenshot(base64: string) {
    const browser = Mock.ofType<Browser>();
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(base64))
      .verifiable();
    return browser;
  }

  function getDifferWithResult(base: Buffer, screenshot: Buffer, result: DiffResult) {
    const pngEditor = Mock.ofType<PNGDiffer>();
    pngEditor
      .setup(e => e.compare(base, screenshot))
      .returns(() => Promise.resolve(result))
      .verifiable();
    return pngEditor;
  }

  async function expectError(
    checkCall: ReturnType<VisualRegressionTester['check']>,
    diff?: Buffer
  ) {
    let errored = 0;

    try {
      await checkCall;
    } catch (result) {
      errored = 1;

      expect(result).to.be.instanceOf(Error);
      expect(result.message).to.contain('Visual changes detected');

      expect(result.diff).to.deep.equal(diff);
    }

    if (!errored) {
      throw new AssertionError('Expected Mugshot to throw an error');
    }
  }

  it('should pass for an existing identical screenshot', async () => {
    const browser = getBrowserWithScreenshot(blackPixelB64);
    const fs = getFsWithExistingBaseline(
      'results/existing-identical.png',
      blackPixelBuffer
    );
    const pngEditor = getDifferWithResult(
      blackPixelBuffer,
      blackPixelBuffer,
      { matches: true }
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngEditor.object
    });

    const result = await mugshot.check('existing-identical');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    expect(result.matches).to.be.true;
  });

  it('should fail and create diff', async () => {
    const browser = getBrowserWithScreenshot(blackPixelB64);

    const fs = getFsWithExistingBaseline(
      'results/existing-diff.png',
      whitePixelBuffer
    );
    fs
      .setup(f => f.outputFile('results/existing-diff.diff.png', blackWhiteDiffBuffer))
      .returns(() => Promise.resolve())
      .verifiable();

    const pngEditor = getDifferWithResult(
      whitePixelBuffer,
      blackPixelBuffer,
      { matches: false, diff: blackWhiteDiffBuffer }
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngEditor.object
    });

    await expectError(
      mugshot.check('existing-diff'),
      blackWhiteDiffBuffer
    );

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();
  });

  it('should fail for a missing baseline', async () => {
    const browser = Mock.ofType<Browser>();
    browser.setup(b => b.takeScreenshot()).verifiable(Times.never());

    const pngEditor = Mock.ofType<PNGDiffer>();
    pngEditor.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

    const fs = getFsWithMissingBaseline(
      'results/missing.png',
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngEditor.object,
      createBaselines: false
    });

    await expectError(
      mugshot.check('missing'),
      Buffer.from('')
    );

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();
  });

  it('should write missing baseline and pass', async () => {
    const pngEditor = Mock.ofType<PNGDiffer>();
    pngEditor.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

    const browser = getBrowserWithScreenshot(blackPixelB64);

    const fs = getFsWithMissingBaseline(
      'results/missing.png',
    );

    fs
      .setup(f => f.outputFile('results/missing.png', blackPixelBuffer))
      .returns(() => Promise.resolve())
      .verifiable();

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngDiffer: pngEditor.object,
      createBaselines: true
    });

    const result = await mugshot.check('missing');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    expect(result.matches).to.be.true;
  });
});
