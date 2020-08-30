import { loadFixture, webdriverContractTests } from '@mugshot/contracts';
import fs from 'fs-extra';
import { PixelDiffer } from 'mugshot';
import path from 'path';
import { expect } from 'tdd-buffet/expect/chai';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { remote, BrowserObject } from 'webdriverio';
import WebdriverIOAdapter from '../src';

describe('WebdriverIOAdapter', () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const browserName of ['chrome', 'firefox']) {
    describe(browserName, () => {
      let browser!: BrowserObject;

      beforeEach(async () => {
        const options: WebDriver.Options = {
          hostname: process.env.SELENIUM_HOST!,
          port: parseInt(process.env.SELENIUM_PORT!, 10),
          capabilities: { browserName },
          logLevel: 'error',
        };

        browser = await remote(options);
      });

      afterEach(() => browser.deleteSession());

      webdriverContractTests.forEach((test) => {
        it(test.name, () => test.run(browser, new WebdriverIOAdapter(browser)));
      });

      async function expectIdenticalScreenshots(
        screenshot: Buffer | string,
        baselineName: string,
        message?: string
      ) {
        const baseline = await fs.readFile(
          path.join(__dirname, `screenshots/${browserName}/${baselineName}.png`)
        );

        if (typeof screenshot === 'string') {
          // eslint-disable-next-line no-param-reassign
          screenshot = await fs.readFile(screenshot);
        }

        const differ = new PixelDiffer({ threshold: 0 });
        expect((await differ.compare(baseline, screenshot)).matches, message).to
          .be.true;
      }

      it('should take a full page screenshot', async () => {
        const clientAdapter = new WebdriverIOAdapter(browser);

        await loadFixture(browser, clientAdapter, 'simple');
        const screenshot = Buffer.from(
          await clientAdapter.takeScreenshot(),
          'base64'
        );

        await expectIdenticalScreenshots(screenshot, 'simple');
      });

      it('should take a full page screenshot with absolutely positioned elements', async () => {
        const clientAdapter = new WebdriverIOAdapter(browser);

        await loadFixture(browser, clientAdapter, 'rect');
        const screenshot = Buffer.from(
          await clientAdapter.takeScreenshot(),
          'base64'
        );

        await expectIdenticalScreenshots(screenshot, 'full-absolute');
      });
    });
  }
});
