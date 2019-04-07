import { describe, expect, it } from '../suite';
import Mugshot, { Browser, FileSystem } from '../../../src';
import { Mock } from 'typemoq';
import { PNGEditor } from '../../../src/jimp-editor';

describe('Mugshot', () => {
  const blackPixelB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  const whitePixelB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
  const blackPixelBuffer = Buffer.from(blackPixelB64, 'base64');
  const whitePixelBuffer = Buffer.from(whitePixelB64, 'base64');

  it('should pass for an existing identical screenshot', async () => {
    const browser = Mock.ofType<Browser>();
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(blackPixelB64))
      .verifiable();

    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.readFile('existing-identical'))
      .returns(() => Promise.resolve(blackPixelBuffer))
      .verifiable();

    const differ = Mock.ofType<PNGEditor>();
    differ
      .setup(d => d.compare(blackPixelBuffer, blackPixelBuffer))
      .returns(() => Promise.resolve(true))
      .verifiable();

    const mugshot = new Mugshot(browser.object, {
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
    const browser = Mock.ofType<Browser>();
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(blackPixelB64))
      .verifiable();

    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.readFile('existing-diff'))
      .returns(() => Promise.resolve(whitePixelBuffer))
      .verifiable();

    const differ = Mock.ofType<PNGEditor>();
    differ
      .setup(d => d.compare(whitePixelBuffer, blackPixelBuffer))
      .returns(() => Promise.resolve(false))
      .verifiable();

    const mugshot = new Mugshot(browser.object, {
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