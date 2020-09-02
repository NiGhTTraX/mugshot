import { webdriverContractSuites } from '@mugshot/contracts';
import playwright, { Browser, Page } from 'playwright';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import PlaywrightAdapter from '../src';

describe(`PlaywrightAdapter`, () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const browserName of ['chromium', 'firefox'] as const) {
    describe(browserName, () => {
      let browser!: Browser;
      let page!: Page;

      beforeEach(async () => {
        browser = await playwright[browserName].launch();
        const context = await browser.newContext();
        page = await context.newPage();
      });

      afterEach(async () => {
        await browser.close();
      });

      const client = {
        url: (path: string) => page.goto(path),
      };

      Object.keys(webdriverContractSuites).forEach((suite) => {
        describe(suite, () => {
          webdriverContractSuites[suite].forEach((test) => {
            it(test.name, () => test.run(client, new PlaywrightAdapter(page)));
          });
        });
      });
    });
  }
});
