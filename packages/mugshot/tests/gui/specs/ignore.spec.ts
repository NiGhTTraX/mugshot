import WebdriverIOAdapter from '@mugshot/webdriverio';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';
import {
  createResultsDirWithBaseline,
  loadFixture
} from '../../../../../tests/gui/suite';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  describe('ignore', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('ignore');
    });

    it('should ignore an element', async browser => {
      await loadFixture(browser, 'simple');

      const mugshot = new Mugshot(
        new WebdriverIOAdapter(browser),
        new FsStorage(resultsPath)
      );

      const result = await mugshot.check('ignore', { ignore: 'div' });

      expect(result.matches).to.be.true;
    });
  });
});
