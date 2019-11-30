import WebdriverIOAdapter from '@mugshot/webdriverio';
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';
import {
  expectIdenticalScreenshots,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserViewportCropScreenshotter from '../../../src/lib/browser-viewport-crop-screenshotter';
import FsStorage from '../../../src/lib/fs-storage';
import JimpProcessor from '../../../src/lib/jimp-processor';
import Mugshot from '../../../src/lib/mugshot';

describe('Mugshot', async () => {
  describe('baselines', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await fs.mkdtemp(`/tmp/mugshot-${process.env.BROWSER}`);
    });

    it('should write first baseline', async browser => {
      await loadFixture(browser, 'simple');

      const baselinePath = path.join(resultsPath, 'new.png');

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

      const resultWhenMissingBaseline = await mugshot.check('new');
      expect(resultWhenMissingBaseline.matches).to.be.true;
      expect(await fs.pathExists(baselinePath), "Baseline wasn't written").to.be
        .true;

      await expectIdenticalScreenshots(
        path.join(resultsPath, 'new.png'),
        'simple',
        `The written baseline ${baselinePath} doesn't match expected one`
      );
    });

    it('should create parent folders when writing baseline', async browser => {
      await loadFixture(browser, 'simple');

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

      await mugshot.check('foo/bar/new');

      expect(
        await fs.pathExists(path.join(resultsPath, 'foo/bar')),
        "Baseline folder structure wasn't created"
      ).to.be.true;
    });
  });
});
