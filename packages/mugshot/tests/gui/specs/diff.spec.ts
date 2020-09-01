import { Fixture, loadFixture } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it, afterEach } from 'tdd-buffet/suite/node';
import { expectIdenticalScreenshots } from '../../../../../tests/helpers';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverScreenshotter from '../../../src/lib/webdriver-screenshotter';
import { createResultsDirWithBaseline } from '../helpers';

describe('Mugshot', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  describe('diff', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('simple');
    });

    it('should create diff', async () => {
      const diffPath = path.join(resultsPath, 'simple.diff.png');

      const adapter = new PuppeteerAdapter(page);
      const mugshot = new Mugshot(
        new WebdriverScreenshotter(adapter),
        new FsStorage(resultsPath),
        {
          createMissingBaselines: true,
        }
      );

      await loadFixture(
        { url: (url) => page.goto(url) },
        adapter,
        Fixture.simple2
      );

      await mugshot.check('simple');

      expect(await fs.pathExists(diffPath), "Diff wasn't written").to.be.true;

      await expectIdenticalScreenshots(
        diffPath,
        path.join(__dirname, '../screenshots/simple.diff.png')
      );
    });
  });
});
