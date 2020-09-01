import {
  Fixture,
  loadFixture,
  webdriverContractTests,
} from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { expectIdenticalScreenshots } from '../../../tests/helpers';

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

  it('should take a full page screenshot', async () => {
    const clientAdapter = new PuppeteerAdapter(page);

    await loadFixture(
      { url: (path) => page.goto(path) },
      clientAdapter,
      Fixture.simple
    );

    const screenshot = Buffer.from(
      await clientAdapter.takeScreenshot(),
      'base64'
    );

    await expectIdenticalScreenshots(
      screenshot,
      join(__dirname, `screenshots/simple.png`)
    );
  });

  it('should take a full page screenshot with absolutely positioned elements', async () => {
    const clientAdapter = new PuppeteerAdapter(page);

    await loadFixture(
      { url: (path) => page.goto(path) },
      clientAdapter,
      Fixture.rect
    );

    const screenshot = Buffer.from(
      await clientAdapter.takeScreenshot(),
      'base64'
    );

    await expectIdenticalScreenshots(
      screenshot,
      join(__dirname, `screenshots/full-absolute.png`)
    );
  });
});
