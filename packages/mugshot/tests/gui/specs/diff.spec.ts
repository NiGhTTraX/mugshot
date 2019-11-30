import WebdriverIOAdapter from '@mugshot/webdriverio';
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';
import {
  createResultsDirWithBaseline,
  expectIdenticalScreenshots,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserViewportCropScreenshotter from '../../../src/lib/browser-viewport-crop-screenshotter';
import FsStorage from '../../../src/lib/fs-storage';
import JimpProcessor from '../../../src/lib/jimp-processor';
import Mugshot from '../../../src/lib/mugshot';

describe('Mugshot', async () => {
  describe('diff', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('simple');
    });

    it('should create diff', async browser => {
      await loadFixture(browser, 'simple2');

      const diffPath = path.join(resultsPath, 'simple.diff.png');

      const mugshot = new Mugshot(
        new WebdriverIOAdapter(browser),
        new FsStorage(resultsPath),
        {
          createMissingBaselines: true,
          screenshotter: new BrowserViewportCropScreenshotter(
            new WebdriverIOAdapter(browser),
            new JimpProcessor()
          )
        }
      );

      await mugshot.check('simple');

      expect(await fs.pathExists(diffPath), "Diff wasn't written").to.be.true;

      await expectIdenticalScreenshots(
        diffPath,
        'simple.diff',
        `The written diff ${diffPath} doesn't match expected one`
      );
    });
  });
});
