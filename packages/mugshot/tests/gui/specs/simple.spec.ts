import { Fixture, loadFixture } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer, { Browser, Page } from 'puppeteer';
import { FsStorage } from '../../../src/lib/fs-storage';
import { Mugshot } from '../../../src/lib/mugshot';
import { WebdriverScreenshotter } from '../../../src/lib/webdriver-screenshotter';
import { createResultsDirWithBaseline } from '../helpers';

describe('Mugshot', () => {
  let resultsPath!: string;
  let browser!: Browser, page!: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    resultsPath = await createResultsDirWithBaseline('simple');
  });

  it('should pass when identical', async () => {
    const adapter = new PuppeteerAdapter(page);
    const mugshot = new Mugshot(
      new WebdriverScreenshotter(adapter),
      new FsStorage(resultsPath)
    );

    await loadFixture(
      { url: (url) => page.goto(url) },
      adapter,
      Fixture.simple
    );

    const result = await mugshot.check('simple');

    expect(result.matches).toBeTruthy();
  });

  it('should fail when different', async () => {
    const adapter = new PuppeteerAdapter(page);
    const mugshot = new Mugshot(
      new WebdriverScreenshotter(adapter),
      new FsStorage(resultsPath)
    );

    await loadFixture(
      { url: (url) => page.goto(url) },
      adapter,
      Fixture.simple2
    );

    const result = await mugshot.check('simple');

    expect(result.matches).toBeFalsy();
  });
});
