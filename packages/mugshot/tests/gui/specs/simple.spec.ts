import { Fixture, loadFixture } from '@mugshot/contracts';
// Suppressing the error to avoid circular dependencies.
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlaywrightAdapter } from '@mugshot/playwright';
import playwright, { Browser, Page } from 'playwright';
import { FsStorage } from '../../../src/lib/fs-storage';
import { Mugshot } from '../../../src/lib/mugshot';
import { WebdriverScreenshotter } from '../../../src/lib/webdriver-screenshotter';
import { createResultsDirWithBaseline } from '../helpers';

describe('Mugshot', () => {
  let resultsPath!: string;
  let browser!: Browser, page!: Page;

  beforeAll(async () => {
    browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    resultsPath = await createResultsDirWithBaseline('simple');
  });

  it('should pass when identical', async () => {
    const adapter = new PlaywrightAdapter(page);
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
    const adapter = new PlaywrightAdapter(page);
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

  it('should use sane defaults for basic constructor', async () => {
    const adapter = new PlaywrightAdapter(page);
    const mugshot = new Mugshot(adapter, resultsPath);

    await loadFixture(
      { url: (url) => page.goto(url) },
      adapter,
      Fixture.simple
    );

    const result = await mugshot.check('simple');

    expect(result.matches).toBeTruthy();
  });
});
