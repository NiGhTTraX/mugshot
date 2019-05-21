import path from 'path';
import fs from 'fs-extra';
import { beforeEach, describe, expect, it, loadFixture } from '../../../../../tests/gui/suite';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';

describe('Mugshot', () => {
  describe('Element screenshots', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      const browser = process.env.BROWSER;

      resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

      // TODO: create a helper for this
      await fs.copyFile(
        path.join(__dirname, `../../../../../tests/gui/screenshots/${browser}/rect.png`),
        path.join(resultsPath, 'rect.png')
      );
    });

    it('should take a screenshot of an absolutely positioned element', async browser => {
      await loadFixture('rect');

      const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

      const result = await mugshot.check('rect', '.test');

      expect(result.matches).to.be.true;
    });
  });
});
