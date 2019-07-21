import { expectIdenticalScreenshots, loadFixture } from '../../../../../tests/gui/suite';
import WebdriverIOAdapter from '../../../src/lib/webdriverio-adapter';
import browserContractTests from '@mugshot/browser-contract';
import { describe, it } from 'tdd-buffet/suite/gui';

describe('WebdriverIOAdapter', () => {
  browserContractTests.forEach(test => {
    it(test.name, async browser => test.getTest(browser, new WebdriverIOAdapter(browser))());
  });

  it('should take a full page screenshot', async browser => {
    await loadFixture(browser, 'simple');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(await browserAdapter.takeScreenshot(), 'base64');

    await expectIdenticalScreenshots(screenshot, 'simple');
  });

  it('should take a full page screenshot with absolutely positioned elements', async browser => {
    await loadFixture(browser, 'rect');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(await browserAdapter.takeScreenshot(), 'base64');

    await expectIdenticalScreenshots(screenshot, 'full-absolute');
  });
});
