import { webdriverContractSuites } from '@mugshot/contracts';
import playwright, { Browser, BrowserContext, Page } from 'playwright';
import PlaywrightAdapter from '../src';

const { BROWSER } = process.env as {
  BROWSER: 'chromium' | 'firefox' | undefined;
};

if (!BROWSER) {
  throw new Error('BROWSER env var missing');
}

describe(`PlaywrightAdapter`, () => {
  describe(BROWSER, () => {
    let browser!: Browser;
    let page!: Page;
    let context!: BrowserContext;

    beforeAll(async () => {
      browser = await playwright[BROWSER].launch();
      context = await browser.newContext();
    });

    beforeEach(async () => {
      page = await context.newPage();
    });

    afterAll(async () => {
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
});
