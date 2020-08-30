import { webdriverContractTests } from '@mugshot/contracts';
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

      // TODO: re-enable these
      // it('should take a full page screenshot', async (browser) => {
      //   await loadFixture(browser, 'simple');
      //
      //   const clientAdapter = new WebdriverIOAdapter(browser);
      //   const screenshot = Buffer.from(
      //     await clientAdapter.takeScreenshot(),
      //     'base64'
      //   );
      //
      //   await expectIdenticalScreenshots(screenshot, 'simple');
      // });
      //
      // it('should take a full page screenshot with absolutely positioned elements', async (browser) => {
      //   await loadFixture(browser, 'rect');
      //
      //   const clientAdapter = new WebdriverIOAdapter(browser);
      //   const screenshot = Buffer.from(
      //     await clientAdapter.takeScreenshot(),
      //     'base64'
      //   );
      //
      //   await expectIdenticalScreenshots(screenshot, 'full-absolute');
      // });
    });
  }
});
