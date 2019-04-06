import { describe, it, expect } from '../suite';
import Mugshot, { Browser, Differ, FileSystem } from '../../../src';
import { Mock } from 'typemoq';

describe('Mugshot', () => {
  const blackPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  const whitePixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

  it('should pass for an existing identical screenshot', async () => {
    const browser = Mock.ofType<Browser>();
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(blackPixel))
      .verifiable();

    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.readFile('existing-identical'))
      .returns(() => Promise.resolve(Buffer.from(blackPixel)))
      .verifiable();

    const differ = Mock.ofType<Differ>();
    differ
      .setup(d => d.compare(Buffer.from(blackPixel), Buffer.from(blackPixel)))
      .returns(() => Promise.resolve(true))
      .verifiable();

    const mugshot = new Mugshot(browser.object, {
      fs: fs.object,
      differ: differ.object
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
      .returns(() => Promise.resolve(blackPixel))
      .verifiable();

    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.readFile('existing-diff'))
      .returns(() => Promise.resolve(Buffer.from(whitePixel)))
      .verifiable();

    const differ = Mock.ofType<Differ>();
    differ
      .setup(d => d.compare(Buffer.from(whitePixel), Buffer.from(blackPixel)))
      .returns(() => Promise.resolve(false))
      .verifiable();

    const mugshot = new Mugshot(browser.object, {
      fs: fs.object,
      differ: differ.object
    });

    const result = await mugshot.check('existing-diff');

    browser.verifyAll();
    fs.verifyAll();
    differ.verifyAll();

    expect(result.matches).to.be.false;
  });
});
