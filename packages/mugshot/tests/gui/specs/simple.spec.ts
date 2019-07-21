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
  let resultsPath!: string;

  beforeEach(async () => {
    resultsPath = await createResultsDirWithBaseline('simple');
  });

  it('should pass when identical', async browser => {
    await loadFixture('simple');

    const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async browser => {
    await loadFixture('simple2');

    const mugshot = new Mugshot(new WebdriverIOAdapter(browser), resultsPath);

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.false;
  });
});
