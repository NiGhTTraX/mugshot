import {
  beforeEach,
  createResultsDirWithBaseline,
  describe,
  expect,
  it,
  loadFixture
} from '../../../../../tests/gui/suite';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';

describe('Mugshot', () => {
  describe('Element screenshots', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('rect');
    });

    it('should take a screenshot of an absolutely positioned element', async browser => {
      await loadFixture('rect');

      const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

      const result = await mugshot.check('rect', '.test');

      expect(result.matches).to.be.true;
    });
  });
});
