import path from 'path';
import fs from 'fs-extra';
import {
  describe,
  expect,
  it,
  beforeEach,
  loadFixture,
  compareScreenshots
} from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpDiffer from '../../../src/lib/jimp-differ';
import WebdriverIOAdapter from '../../../src/lib/webdriverio-adapter';

describe('Mugshot', async () => {
  let resultsPath!: string;

  beforeEach(async () => {
    const browser = process.env.BROWSER;

    resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

    await fs.copyFile(
      path.join(__dirname, `../screenshots/${browser}/simple.png`),
      path.join(resultsPath, 'simple.png')
    );
  });

  it('should create diff', async browser => {
    await loadFixture('simple2');

    const diffPath = path.join(resultsPath, 'simple.diff.png');

    const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath, {
      fs,
      pngDiffer: jimpDiffer,
      createBaselines: true
    });

    await mugshot.check('simple');

    expect(
      await fs.pathExists(diffPath),
      'Diff wasn\'t written'
    ).to.be.true;

    await compareScreenshots(
      diffPath,
      'simple.diff',
      `The written diff ${diffPath} doesn't match expected one`
    );
  });
});
