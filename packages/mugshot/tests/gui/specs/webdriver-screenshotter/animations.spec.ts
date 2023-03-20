import {
  expectIdenticalScreenshots,
  Fixture,
  loadFixture,
} from '@mugshot/contracts';
// Suppressing the error to avoid circular dependencies.
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlaywrightAdapter } from '@mugshot/playwright';
import { join } from 'path';
import playwright, { Browser, Page } from 'playwright';
import { WebdriverScreenshotter } from '../../../../src/lib/webdriver-screenshotter';

describe('WebdriverScreenshotter', () => {
  let browser!: Browser, page!: Page;

  beforeAll(async () => {
    browser = await playwright.chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should disable animations', async () => {
    const adapter = new PlaywrightAdapter(page);
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
