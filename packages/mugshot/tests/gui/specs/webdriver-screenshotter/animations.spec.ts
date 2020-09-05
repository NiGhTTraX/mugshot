import { Fixture, loadFixture } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { expectIdenticalScreenshots } from '../../../../../../tests/helpers';
import WebdriverScreenshotter from '../../../../src/lib/webdriver-screenshotter';

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
