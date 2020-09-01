import {
  Fixture,
  loadFixture,
  webdriverContractTests,
} from '@mugshot/contracts';
import { join } from 'path';
import playwright, { Browser, Page } from 'playwright';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { expectIdenticalScreenshots } from '../../../tests/helpers';
import PlaywrightAdapter from '../src';

describe(`PlaywrightAdapter`, () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const browserName of ['chromium', 'firefox'] as const) {
    describe(browserName, () => {
      let browser!: Browser;
      let page!: Page;

      beforeEach(async () => {
        browser = await playwright[browserName].launch();
        const context = await browser.newContext();
        page = await context.newPage();
      });

      afterEach(async () => {
        await browser.close();
      });

      webdriverContractTests.forEach((test) => {
        it(test.name, async () =>
          test.run(
            {
              url: (path) => page.goto(path),
            },
            new PlaywrightAdapter(page)
          )
        );
      });

      it('should take a full page screenshot', async () => {
        const clientAdapter = new PlaywrightAdapter(page);

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
          join(__dirname, `screenshots/${browserName}/simple.png`)
        );
      });

      it('should take a full page screenshot with absolutely positioned elements', async () => {
        const clientAdapter = new PlaywrightAdapter(page);

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
          join(__dirname, `screenshots/${browserName}/full-absolute.png`)
        );
      });
    });
  }
});
