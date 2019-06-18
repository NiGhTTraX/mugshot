import {
  describe,
  expectIdenticalScreenshots,
  it,
  loadFixture
} from '../../../../../tests/gui/suite';
import WebdriverIOAdapter from '../../../src/lib/webdriverio-adapter';
import browserContractTests from '@mugshot/browser-contract';

describe('WebdriverIOAdapter', () => {
  browserContractTests.forEach(test => {
    it(test.name, async browser => test.getTest(browser, new WebdriverIOAdapter(browser))());
  });

  it('should take a full page screenshot', async browser => {
    await loadFixture('simple');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(await browserAdapter.takeScreenshot(), 'base64');

    await expectIdenticalScreenshots(screenshot, 'simple');
  });

  it('should take a full page screenshot with absolutely positioned elements', async browser => {
    await loadFixture('rect');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(await browserAdapter.takeScreenshot(), 'base64');

    await expectIdenticalScreenshots(screenshot, 'full-absolute');
  });
});
