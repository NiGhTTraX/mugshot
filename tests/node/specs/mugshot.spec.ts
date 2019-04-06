import { describe, it, expect } from '../suite';
import Mugshot, { Browser, FileSystem } from '../../../src';
import { Mock } from 'typemoq';

describe('Mugshot', () => {
  it('should pass for an existing identical screenshot', async () => {
    const base = 'abc';

    const browser = Mock.ofType<Browser>();
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(base))
      .verifiable();

    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.read('existing-identical'))
      .returns(() => Promise.resolve(base))
      .verifiable();

    const mugshot = new Mugshot(browser.object, fs.object);

    const result = await mugshot.check('existing-identical');

    expect(result.matches).to.be.true;

    browser.verifyAll();
    fs.verifyAll();
  });

  it('should fail for an existing diff screenshot', async () => {
    const base = 'abc';
    const screenshot = 'not-abc';

    const browser = Mock.ofType<Browser>();
    browser
      .setup(b => b.takeScreenshot())
      .returns(() => Promise.resolve(screenshot))
      .verifiable();

    const fs = Mock.ofType<FileSystem>();
    fs
      .setup(f => f.read('existing-diff'))
      .returns(() => Promise.resolve(base))
      .verifiable();

    const mugshot = new Mugshot(browser.object, fs.object);

    const result = await mugshot.check('existing-diff');

    expect(result.matches).to.be.false;

    browser.verifyAll();
    fs.verifyAll();
  });
});
