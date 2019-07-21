import path from 'path';
import fs from 'fs-extra';
import {
  createResultsDirWithBaseline,
  expectIdenticalScreenshots,
  loadFixture
} from '../../../../../tests/gui/suite';
import { expect } from 'tdd-buffet/suite/expect';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';

describe('Mugshot', async () => {
  describe('diff', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('simple');
    });

    it('should create diff', async browser => {
      await loadFixture(browser, 'simple2');

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
