import { webdriverContractSuites } from '@mugshot/contracts';
import playwright, { Browser, BrowserContext, Page } from 'playwright';
import { after, before, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import PlaywrightAdapter from '../src';

describe(`PlaywrightAdapter`, () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const browserName of ['chromium', 'firefox'] as const) {
    describe(browserName, () => {
      let browser!: Browser;
      let page!: Page;
      let context!: BrowserContext;

      before(async () => {
        browser = await playwright[browserName].launch();
        context = await browser.newContext();
      });

      beforeEach(async () => {
        page = await context.newPage();
      });

      after(async () => {
        await browser.close();
      });

      const setup = {
        url: (path: string) => page.goto(path),
      };

      Object.keys(webdriverContractSuites).forEach((suite) => {
        describe(suite, () => {
          webdriverContractSuites[suite].forEach((test) => {
            it(test.name, () => test.run(setup, new PlaywrightAdapter(page)));
          });
        });
      });
    });
  }
});
