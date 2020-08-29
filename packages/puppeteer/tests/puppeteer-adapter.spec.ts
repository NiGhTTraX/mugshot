import { webdriverContractTests } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';

describe('PuppeteerAdapter', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  webdriverContractTests.forEach((test) => {
    it(test.name, () =>
      test.run(
        {
          url: (path) => page.goto(path),
        },
        new PuppeteerAdapter(page)
      )
    );
  });

  // TODO: add screenshots tests
});
