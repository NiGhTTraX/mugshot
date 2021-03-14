import {
  Fixture,
  loadFixture,
  expectIdenticalScreenshots,
} from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import { join } from 'path';
import puppeteer from 'puppeteer';
import WebdriverScreenshotter from '../../../../src/lib/webdriver-screenshotter';

describe('WebdriverScreenshotter', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should disable animations', async () => {
    const adapter = new PuppeteerAdapter(page);
    const screenshotter = new WebdriverScreenshotter(adapter, {
      disableAnimations: true,
    });

    await loadFixture(
      { url: (path) => page.goto(path) },
      adapter,
      Fixture.animations
    );

    await expectIdenticalScreenshots(
      await screenshotter.takeScreenshot(),
      join(__dirname, '../../screenshots/animations.png')
    );
  });
});
