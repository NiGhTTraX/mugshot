import { webdriverContractSuites } from '@mugshot/contracts';
import puppeteer, { Browser, Page } from 'puppeteer';
import { PuppeteerAdapter } from '../src';

describe('PuppeteerAdapter', () => {
  let browser!: Browser, page!: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
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
        it(test.name, () => test.run(setup, new PuppeteerAdapter(page)));
      });
    });
  });
});
