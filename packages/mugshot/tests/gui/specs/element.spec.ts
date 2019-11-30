import WebdriverIOAdapter from '@mugshot/webdriverio';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';
import {
  createResultsDirWithBaseline,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserViewportCropScreenshotter from '../../../src/lib/browser-viewport-crop-screenshotter';
import FsStorage from '../../../src/lib/fs-storage';
import JimpProcessor from '../../../src/lib/jimp-processor';
import Mugshot from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  describe('Element screenshots', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('rect');
    });

    it('should take a screenshot of an absolutely positioned element', async browser => {
      await loadFixture(browser, 'rect');

      const mugshot = new Mugshot(new FsStorage(resultsPath), {
        screenshotter: new BrowserViewportCropScreenshotter(
          new WebdriverIOAdapter(browser),
          new JimpProcessor()
        )
      });

      const result = await mugshot.check('rect', '.test');

      expect(result.matches).to.be.true;
    });
  });
});
