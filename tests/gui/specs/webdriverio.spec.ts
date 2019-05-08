import { describe, expect, it, loadFixture } from '../suite';
import fs from 'fs-extra';
import path from 'path';
import jimp from 'jimp';

describe('webdriverio', () => {
  async function compareScreenshot(screenshot: Buffer, baseline: string) {
    const result = jimp.diff(
      await jimp.read(
        await fs.readFile(path.join(__dirname, `../screenshots/${process.env.BROWSER}/${baseline}.png`))
      ),
      await jimp.read(screenshot)
    );

    expect(result.percent).to.equal(0);
  }

  it('should take a full page screenshot', async browser => {
    await loadFixture('simple');

    const screenshot = Buffer.from(await browser.takeScreenshot(), 'base64');

    await compareScreenshot(screenshot, 'simple');
  });

  it('should get bounding rect', async browser => {
    await loadFixture('rect');

    // TODO: replace with standard command (findElement?)
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
