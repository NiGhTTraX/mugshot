import { webdriverContractSuites } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';
import { after, before, beforeEach, describe, it } from 'tdd-buffet/suite/node';

describe('PuppeteerAdapter', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  before(async () => {
    browser = await puppeteer.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
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
        it(test.name, () => test.run(setup, new PuppeteerAdapter(page)));
      });
    });
  });
});
