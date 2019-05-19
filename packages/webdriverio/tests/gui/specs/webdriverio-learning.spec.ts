import { expectIdenticalScreenshots, describe, expect, it, loadFixture } from '../../../../../tests/gui/suite';

describe('webdriverio', () => {
  it('should take a full page screenshot', async browser => {
    await loadFixture('simple');

    const screenshot = Buffer.from(await browser.takeScreenshot(), 'base64');

    await expectIdenticalScreenshots(screenshot, 'simple');
  });

  it('should get bounding rect using a script', async browser => {
    await loadFixture('rect');

    function getBoundingRect(selector: string): DOMRect {
      // @ts-ignore
      return document.querySelector(selector).getBoundingClientRect();
    }

    // @ts-ignore
    const rect: DOMRect = await browser.execute(getBoundingRect, '.test');

    // Include margin.
    expect(rect.x).to.equal(8 + 3);
    expect(rect.y).to.equal(10 + 3);

    // Include border and padding.
    expect(rect.width).to.equal(100 + 2 * 2 + 4 * 2);
    expect(rect.height).to.equal(100 + 2 * 2 + 4 * 2);
  });

  it('should get bounding rect of off-screen element', async browser => {
    await loadFixture('rect-scroll');

    function getBoundingRect(selector: string): DOMRect {
      // @ts-ignore
      return document.querySelector(selector).getBoundingClientRect();
    }

    // @ts-ignore
    const rect: DOMRect = await browser.execute(getBoundingRect, '.test');

    expect(rect.x).to.equal(2000);
    expect(rect.y).to.equal(2000);
  });

  it('should get bounding rect using element commands', async browser => {
    await loadFixture('rect');

    const element = await browser.$('.test');

    const location = await element.getLocation();
    // Include margin.
    expect(location.x).to.equal(8 + 3);
    expect(location.y).to.equal(10 + 3);

    const size = await element.getSize();
    // Include border and padding.
    expect(size.width).to.equal(100 + 2 * 2 + 4 * 2);
    expect(size.height).to.equal(100 + 2 * 2 + 4 * 2);
  });
});
