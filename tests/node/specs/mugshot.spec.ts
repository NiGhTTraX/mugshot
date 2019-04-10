import { describe, expect, it } from '../suite';
import Mugshot, { Browser, FileSystem } from '../../../src/mugshot';
import { It, Mock, Times } from 'typemoq';
import PNGEditor, { DiffResult } from '../../../src/interfaces/png-editor';
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
    const pngEditor = Mock.ofType<PNGEditor>();
    pngEditor
      .setup(e => e.compare(base, screenshot))
      .returns(() => Promise.resolve(result))
      .verifiable();
    return pngEditor;
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
      pngEditor: pngEditor.object
    });

    const result = await mugshot.check('existing-identical');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    expect(result.matches).to.be.true;
  });

  it('should fail for an existing diff screenshot', async () => {
    const browser = getBrowserWithScreenshot(blackPixelB64);
    const fs = getFsWithExistingBaseline(
      'results/existing-diff.png',
      whitePixelBuffer
    );
    const pngEditor = getDifferWithResult(
      whitePixelBuffer,
      blackPixelBuffer,
      { matches: false, diff: Buffer.from(':irrelevant:') }
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngEditor: pngEditor.object
    });

    const result = await mugshot.check('existing-diff');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    expect(result.matches).to.be.false;
  });

  it('should fail for a missing baseline', async () => {
    const browser = Mock.ofType<Browser>();
    browser.setup(b => b.takeScreenshot()).verifiable(Times.never());

    const pngEditor = Mock.ofType<PNGEditor>();
    pngEditor.setup(e => e.compare(It.isAny(), It.isAny())).verifiable(Times.never());

    const fs = getFsWithMissingBaseline(
      'results/missing.png',
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngEditor: pngEditor.object,
      createBaselines: false
    });

    const result = await mugshot.check('missing');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    expect(result.matches).to.be.false;
  });

  it('should write missing baseline and pass', async () => {
    const pngEditor = Mock.ofType<PNGEditor>();
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
      pngEditor: pngEditor.object,
      createBaselines: true
    });

    const result = await mugshot.check('missing');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    expect(result.matches).to.be.true;
  });

  it('should create diff', async () => {
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
      pngEditor: pngEditor.object
    });

    const result = await mugshot.check('existing-diff');

    browser.verifyAll();
    fs.verifyAll();
    pngEditor.verifyAll();

    // @ts-ignore
    expect(result.diff).to.deep.equal(blackWhiteDiffBuffer);
  });
});
