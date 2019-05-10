import { describe, it, loadFixture, compareScreenshots } from '../../suite';
import WebdriverIOAdapter from '../../../../src/lib/webdriverio-adapter';

describe('WebdriverIOAdapter', () => {
  it('should take a full page screenshot', async browser => {
    await loadFixture('simple');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(await browserAdapter.takeScreenshot(), 'base64');

    await compareScreenshots(screenshot, 'simple');
  });
});
