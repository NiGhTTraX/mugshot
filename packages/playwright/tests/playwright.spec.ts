import { webdriverContractTests } from '@mugshot/contracts';
import playwright, { Browser, Page } from 'playwright';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import PlaywrightAdapter from '../src';

describe(`PlaywrightAdapter`, () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const browserType of ['chromium', 'firefox'] as const) {
    describe(browserType, () => {
      let browser!: Browser;
      let page!: Page;

      beforeEach(async () => {
        browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        page = await context.newPage();
      });

      afterEach(async () => {
        await browser.close();
      });

      webdriverContractTests.forEach((test) => {
        it(test.name, async () =>
          test.run(
            {
              url: (path) => page.goto(path),
            },
            new PlaywrightAdapter(page)
          )
        );
      });

      // TODO: add screenshots tests
    });
  }
});
