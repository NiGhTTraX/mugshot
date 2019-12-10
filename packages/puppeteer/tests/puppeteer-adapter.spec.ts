import { browserContractTests } from '@mugshot/contracts';
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

  browserContractTests.forEach(test => {
    it(test.name, async () => {
      return test.getTest(
        {
          url: path => page.goto(path),
          execute: (func, ...args) => page.evaluate(func, ...args)
        },
        new PuppeteerAdapter(page)
      )();
    });
  });
});
