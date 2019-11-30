import WebdriverIOAdapter from '@mugshot/webdriverio';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';
import {
  createResultsDirWithBaseline,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserScreenshotter from '../../../src/lib/browser-screenshotter';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  describe('Element screenshots', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('rect');
    });

    it('should take a screenshot of an absolutely positioned element', async browser => {
      await loadFixture(browser, 'rect');

      const mugshot = new Mugshot(
        new BrowserScreenshotter(new WebdriverIOAdapter(browser)),
        new FsStorage(resultsPath)
      );

      const result = await mugshot.check('rect', '.test');

      expect(result.matches).to.be.true;
    });
  });
});
