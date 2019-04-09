import path from 'path';
import fs from 'fs-extra';
import { describe, expect, it, loadFixture } from '../suite';
import Mugshot from '../../../src/mugshot';
import jimpEditor from '../../../src/lib/jimp-editor';

describe('Mugshot', () => {
  const resultsPath = path.join(__dirname, `../screenshots/${process.env.BROWSER}`);

  it('should pass when identical', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngEditor: jimpEditor
    });

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async browser => {
    await loadFixture('simple2');

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngEditor: jimpEditor
    });

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.false;
  });

  it('should write first baseline', async browser => {
    await loadFixture('simple2');

    const baselinePath = path.join(resultsPath, 'new.png');
    await fs.remove(baselinePath);

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

    const resultWhenExistingBaseline = await mugshot.check('new');
    expect(resultWhenExistingBaseline.matches).to.be.true;
  });

  it('should write first baseline and parent folder', async browser => {
    await loadFixture('simple2');

    const baselinePath = path.join(resultsPath, 'foo/bar/new.png');
    await fs.remove(baselinePath);

    const mugshot = new Mugshot(browser, resultsPath, {
      fs,
      pngEditor: jimpEditor,
      createBaselines: true
    });

    const resultWhenMissingBaseline = await mugshot.check('foo/bar/new');
    expect(resultWhenMissingBaseline.matches).to.be.true;
    expect(
      await fs.pathExists(baselinePath),
      'Baseline wasn\'t written'
    ).to.be.true;

    const resultWhenExistingBaseline = await mugshot.check('foo/bar/new');
    expect(resultWhenExistingBaseline.matches).to.be.true;
  });
});
