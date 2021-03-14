import { webdriverContractSuites } from '@mugshot/contracts';
import { after, before, describe, it } from 'tdd-buffet/suite/node';
import { Browser, remote, RemoteOptions } from 'webdriverio';
import WebdriverIOAdapter from '../src';

const { BROWSER } = process.env;

if (!BROWSER) {
  throw new Error('BROWSER env var missing');
}

describe('WebdriverIOAdapter', () => {
  describe(BROWSER, () => {
    let browser!: Browser<'async'>;

    before(async () => {
      const options: RemoteOptions = {
        hostname: process.env.SELENIUM_HOST || 'localhost',
        port: parseInt(process.env.SELENIUM_PORT || '4444', 10),
        path: '/wd/hub',
        capabilities: { browserName: BROWSER },
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
});
