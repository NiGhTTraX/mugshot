import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';
import { describe, it, afterEach, beforeEach } from 'tdd-buffet/suite/node';
import WebdriverScreenshotter from '../../../src/lib/webdriver-screenshotter';
import { expectIdenticalScreenshots, loadFixture } from '../helpers';

describe('WebdriverScreenshotter', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should disable animations', async () => {
    await loadFixture(page, 'animations');

    const screenshotter = new WebdriverScreenshotter(
      new PuppeteerAdapter(page),
      {
        disableAnimations: true,
      }
    );

    await expectIdenticalScreenshots(
      await screenshotter.takeScreenshot('.animated'),
      'animations'
    );
  });
});
