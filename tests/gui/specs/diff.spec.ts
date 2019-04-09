import path from 'path';
import fs from 'fs-extra';
import jimp from 'jimp';
import { describe, expect, it, beforeEach, loadFixture } from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpEditor from '../../../src/lib/jimp-editor';

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

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngEditor: jimpEditor,
      createBaselines: true
    });

    await mugshot.check('simple');

    expect(
      await fs.pathExists(diffPath),
      'Diff wasn\'t written'
    ).to.be.true;

    expect(
      (await jimp.diff(
        await jimp.read(diffPath),
        await jimp.read(path.join(__dirname, `../screenshots/${process.env.BROWSER}/simple.diff.png`))
      )).percent,
      'The written baseline doesn\'t match expected one'
    ).to.equal(0);
  });
});
