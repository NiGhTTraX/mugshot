import path from 'path';
import fs from 'fs-extra';
import { describe, expect, it, loadFixture } from '../suite';
import Mugshot from '../../../src';
import jimpEditor from '../../../src/jimp-editor';

describe('Mugshot', () => {
  it('should pass when identical', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(browser, {
      fs,
      pngEditor: jimpEditor
    });

    const result = await mugshot.check(
      path.join(__dirname, '../fixtures/simple.png')
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
      path.join(__dirname, '../fixtures/simple.png')
    );

    expect(result.matches).to.be.false;
  });
});
