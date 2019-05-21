import { describe, it, loadFixture, expectIdenticalScreenshots } from '../../../../../tests/gui/suite';
import { expect } from 'chai';
import WebdriverIOAdapter from '../../../src/lib/webdriverio-adapter';

describe('WebdriverIOAdapter', () => {
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

  it('should get bounding rect of element', async browser => {
    await loadFixture('rect');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const rect = await browserAdapter.getElementRect('.test');

    // Include margin.
    expect(rect.x).to.equal(8 + 3);
    expect(rect.y).to.equal(10 + 3);

    // Include border and padding.
    expect(rect.width).to.equal(100 + 2 * 2 + 4 * 2);
    expect(rect.height).to.equal(100 + 2 * 2 + 4 * 2);
  });

  it('should get bounding rect of off-screen element', async browser => {
    await loadFixture('rect-scroll');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const rect = await browserAdapter.getElementRect('.test');

    expect(rect.x).to.equal(2000);
    expect(rect.y).to.equal(2000);
  });
});
