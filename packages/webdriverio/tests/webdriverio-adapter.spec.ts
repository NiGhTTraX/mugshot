import {
  Fixture,
  loadFixture,
  webdriverContractTests,
} from '@mugshot/contracts';
import { join } from 'path';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { BrowserObject, remote } from 'webdriverio';
import { expectIdenticalScreenshots } from '../../../tests/helpers';
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

      it('should take a full page screenshot', async () => {
        const clientAdapter = new WebdriverIOAdapter(browser);

        await loadFixture(browser, clientAdapter, Fixture.simple);

        const screenshot = Buffer.from(
          await clientAdapter.takeScreenshot(),
          'base64'
        );

        await expectIdenticalScreenshots(
          screenshot,
          join(__dirname, `screenshots/${browserName}/simple.png`)
        );
      });

      it('should take a full page screenshot with absolutely positioned elements', async () => {
        const clientAdapter = new WebdriverIOAdapter(browser);

        await loadFixture(browser, clientAdapter, Fixture.rect);

        const screenshot = Buffer.from(
          await clientAdapter.takeScreenshot(),
          'base64'
        );

        await expectIdenticalScreenshots(
          screenshot,
          join(__dirname, `screenshots/${browserName}/full-absolute.png`)
        );
      });
    });
  }
});
