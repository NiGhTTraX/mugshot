import path from 'path';
import fs from 'fs-extra';
import { describe, expect, it, loadFixture } from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpEditor from '../../../src/lib/jimp-editor';

describe('Mugshot', () => {
  it('should pass when identical', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(browser, {
      fs,
      pngEditor: jimpEditor
    });

    const result = await mugshot.check(
      path.join(__dirname, `../screenshots/${process.env.BROWSER}/simple.png`)
    );

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async browser => {
    await loadFixture('simple2');

    const mugshot = new Mugshot(browser, {
      fs,
      pngEditor: jimpEditor
    });

    const result = await mugshot.check(
      path.join(__dirname, `../screenshots/${process.env.BROWSER}/simple.png`)
    );

    expect(result.matches).to.be.false;
  });
});
