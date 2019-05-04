import path from 'path';
import fs from 'fs-extra';
import { beforeEach, describe, expect, it, loadFixture } from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpDiffer from '../../../src/lib/jimp-differ';

describe('Mugshot', () => {
  let resultsPath!: string;

  beforeEach(async () => {
    const browser = process.env.BROWSER;

    resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

    await fs.copyFile(
      path.join(__dirname, `../screenshots/${browser}/simple.png`),
      path.join(resultsPath, 'simple.png')
    );
  });

  it('should pass when identical', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngDiffer: jimpDiffer
    });

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async browser => {
    await loadFixture('simple2');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngDiffer: jimpDiffer
    });

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.false;
  });
});
