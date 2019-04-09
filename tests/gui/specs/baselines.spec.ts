import path from 'path';
import fs from 'fs-extra';
import jimp from 'jimp';
import { beforeEach, describe, expect, it, loadFixture } from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpEditor from '../../../src/lib/jimp-editor';

describe('Mugshot', async () => {
  let resultsPath!: string;

  beforeEach(async () => {
    resultsPath = await fs.mkdtemp(`/tmp/mugshot-${process.env.BROWSER}`);
  });

  it('should write first baseline', async browser => {
    await loadFixture('simple');

    const baselinePath = path.join(resultsPath, 'new.png');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngEditor: jimpEditor,
      createBaselines: true
    });

    const resultWhenMissingBaseline = await mugshot.check('new');
    expect(resultWhenMissingBaseline.matches).to.be.true;
    expect(
      await fs.pathExists(baselinePath),
      'Baseline wasn\'t written'
    ).to.be.true;

    expect(
      (await jimp.diff(
        await jimp.read(path.join(resultsPath, 'new.png')),
        await jimp.read(path.join(__dirname, `../screenshots/${process.env.BROWSER}/simple.png`))
      )).percent,
      `The written baseline ${baselinePath} doesn't match expected one`
    ).to.equal(0);
  });

  it('should write create parent folder when writing baseline', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngEditor: jimpEditor,
      createBaselines: true
    });

    await mugshot.check('foo/bar/new');

    expect(
      await fs.pathExists(path.join(resultsPath, 'foo/bar')),
      'Baseline folder structure wasn\'t created'
    ).to.be.true;
  });
});
