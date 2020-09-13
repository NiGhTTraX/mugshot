import { webdriverContractSuites } from '@mugshot/contracts';
import { after, before, describe, it } from 'tdd-buffet/suite/node';
import { BrowserObject, remote, RemoteOptions } from 'webdriverio';
import WebdriverIOAdapter from '../src';

describe('WebdriverIOAdapter', () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const browserName of ['chrome', 'firefox']) {
    describe(browserName, () => {
      let browser!: BrowserObject;

      before(async () => {
        const options: RemoteOptions = {
          hostname: process.env.SELENIUM_HOST!,
          port: parseInt(process.env.SELENIUM_PORT!, 10),
          path: '/wd/hub',
          capabilities: { browserName },
          logLevel: 'error',
        };

        browser = await remote(options);
      });

      after(() => browser.deleteSession());

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
