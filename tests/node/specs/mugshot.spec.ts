import { describe, expect, it } from '../suite';
import Mugshot, { Browser, FileSystem } from '../../../src/mugshot';
import { Mock } from 'typemoq';
import PNGEditor from '../../../src/interfaces/png-editor';
import { blackPixelB64, blackPixelBuffer, whitePixelBuffer } from '../fixtures';

describe('Mugshot', () => {
  function getFsWithExistingBaseline(path: string, buffer: Buffer) {
    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.readFile(path))
      .returns(() => Promise.resolve(buffer))
      .verifiable();
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

  function getDifferWithResult(base: Buffer, screenshot: Buffer, result: boolean) {
    const differ = Mock.ofType<PNGEditor>();
    differ
      .setup(d => d.compare(base, screenshot))
      .returns(() => Promise.resolve(result))
      .verifiable();
    return differ;
  }

  it('should pass for an existing identical screenshot', async () => {
    const browser = getBrowserWithScreenshot(blackPixelB64);
    const fs = getFsWithExistingBaseline(
      'results/existing-identical.png',
      blackPixelBuffer
    );
    const differ = getDifferWithResult(
      blackPixelBuffer,
      blackPixelBuffer,
      true
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngEditor: differ.object
    });

    const result = await mugshot.check('existing-identical');

    browser.verifyAll();
    fs.verifyAll();
    differ.verifyAll();

    expect(result.matches).to.be.true;
  });

  it('should fail for an existing diff screenshot', async () => {
    const browser = getBrowserWithScreenshot(blackPixelB64);
    const fs = getFsWithExistingBaseline(
      'results/existing-diff.png',
      whitePixelBuffer
    );
    const differ = getDifferWithResult(
      whitePixelBuffer,
      blackPixelBuffer,
      false
    );

    const mugshot = new Mugshot(browser.object, 'results', {
      fs: fs.object,
      pngEditor: differ.object
    });

    const result = await mugshot.check('existing-diff');

    browser.verifyAll();
    fs.verifyAll();
    differ.verifyAll();

    expect(result.matches).to.be.false;
  });
});
