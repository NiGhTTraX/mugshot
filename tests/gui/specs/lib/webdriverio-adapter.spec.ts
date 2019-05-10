import { describe, it, loadFixture, expect } from '../../suite';
import fs from 'fs-extra';
import jimp from 'jimp';
import path from 'path';
import WebdriverIOAdapter from '../../../../src/lib/webdriverio-adapter';

describe('WebdriverIOAdapter', () => {
  async function compareScreenshot(screenshot: Buffer, baseline: string) {
    const result = jimp.diff(
      await jimp.read(
        await fs.readFile(path.join(__dirname, `../../screenshots/${process.env.BROWSER}/${baseline}.png`))
      ),
      await jimp.read(screenshot)
    );

    expect(result.percent).to.equal(0);
  }

  it('should take a full page screenshot', async browser => {
    await loadFixture('simple');

    const browserAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(await browserAdapter.takeScreenshot(), 'base64');

    await compareScreenshot(screenshot, 'simple');
  });
});
