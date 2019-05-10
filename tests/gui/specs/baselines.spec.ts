import path from 'path';
import fs from 'fs-extra';
import {
  beforeEach,
  compareScreenshots,
  describe,
  expect,
  it,
  loadFixture
} from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpDiffer from '../../../src/lib/jimp-differ';

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
      pngDiffer: jimpDiffer,
      createBaselines: true
    });

    const resultWhenMissingBaseline = await mugshot.check('new');
    expect(resultWhenMissingBaseline.matches).to.be.true;
    expect(
      await fs.pathExists(baselinePath),
      'Baseline wasn\'t written'
    ).to.be.true;

    await compareScreenshots(
      path.join(resultsPath, 'new.png'),
      'simple',
      `The written baseline ${baselinePath} doesn't match expected one`
    );
  });

  it('should create parent folders when writing baseline', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngDiffer: jimpDiffer,
      createBaselines: true
    });

    await mugshot.check('foo/bar/new');

    expect(
      await fs.pathExists(path.join(resultsPath, 'foo/bar')),
      'Baseline folder structure wasn\'t created'
    ).to.be.true;
  });
});
