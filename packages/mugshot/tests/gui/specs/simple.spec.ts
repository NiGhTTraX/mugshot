import path from 'path';
import fs from 'fs-extra';
import { beforeEach, describe, expect, it, loadFixture } from '../../../../../tests/gui/suite';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';

describe('Mugshot', () => {
  let resultsPath!: string;

  beforeEach(async () => {
    const browser = process.env.BROWSER;

    resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

    await fs.copyFile(
      path.join(__dirname, `../../../../../tests/gui/screenshots/${browser}/simple.png`),
      path.join(resultsPath, 'simple.png')
    );
  });

  it('should pass when identical', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async browser => {
    await loadFixture('simple2');

    const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.false;
  });
});
