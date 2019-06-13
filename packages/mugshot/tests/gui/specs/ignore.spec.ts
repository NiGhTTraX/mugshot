import path from 'path';
import fs from 'fs-extra';
import { beforeEach, describe, expect, it, loadFixture } from '../../../../../tests/gui/suite';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';

describe('Mugshot', () => {
  describe('ignore', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      const browser = process.env.BROWSER;

      resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

      await fs.copyFile(
        path.join(__dirname, `../../../../../tests/gui/screenshots/${browser}/ignore.png`),
        path.join(resultsPath, 'ignore.png')
      );
    });

    it('should ignore an element', async browser => {
      await loadFixture('simple');

      const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

      const result = await mugshot.check('ignore', { ignore: 'div' });

      expect(result.matches).to.be.true;
    });
  });
});
