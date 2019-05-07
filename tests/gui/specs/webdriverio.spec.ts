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
});
