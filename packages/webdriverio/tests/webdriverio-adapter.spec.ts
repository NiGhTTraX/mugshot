import { webdriverContractSuites } from '@mugshot/contracts';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { BrowserObject, remote } from 'webdriverio';
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

      Object.keys(webdriverContractSuites).forEach((suite) => {
        describe(suite, () => {
          webdriverContractSuites[suite].forEach((test) => {
            it(test.name, () =>
              test.run(browser, new WebdriverIOAdapter(browser))
            );
          });
        });
      });
    });
  }
});
