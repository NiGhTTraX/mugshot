import path from 'path';
import fs from 'fs-extra';
import {
  describe,
  expect,
  it,
  beforeEach,
  loadFixture,
  expectIdenticalScreenshots,
  createResultsDirWithBaseline
} from '../../../../../tests/gui/suite';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';

describe('Mugshot', async () => {
  describe('diff', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('simple');
    });

    it('should create diff', async browser => {
      await loadFixture('simple2');

      const diffPath = path.join(resultsPath, 'simple.diff.png');

      const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath, {
        createMissingBaselines: true
      });

      await mugshot.check('simple');

      expect(
        await fs.pathExists(diffPath),
        'Diff wasn\'t written'
      ).to.be.true;

      await expectIdenticalScreenshots(
        diffPath,
        'simple.diff',
        `The written diff ${diffPath} doesn't match expected one`
      );
    });
  });
});
