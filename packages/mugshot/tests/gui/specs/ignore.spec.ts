import {
  beforeEach,
  createResultsDirWithBaseline,
  describe,
  it,
  loadFixture
} from '../../../../../tests/gui/suite';
import { expect } from 'tdd-buffet/suite/expect';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';

describe('Mugshot', () => {
  describe('ignore', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('ignore');
    });

    it('should ignore an element', async browser => {
      await loadFixture('simple');

      const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

      const result = await mugshot.check('ignore', { ignore: 'div' });

      expect(result.matches).to.be.true;
    });
  });
});
