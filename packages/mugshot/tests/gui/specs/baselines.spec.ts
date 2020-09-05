import { Fixture, loadFixture } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { expect } from 'tdd-buffet/expect/chai';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { expectIdenticalScreenshots } from '../../../../../tests/helpers';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverScreenshotter from '../../../src/lib/webdriver-screenshotter';

describe('Mugshot', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  describe('baselines', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await fs.mkdtemp(`/tmp/mugshot-chrome`);
    });

    it('should write first baseline', async () => {
      const baselinePath = path.join(resultsPath, 'new.png');

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
        Fixture.simple
      );

      const resultWhenMissingBaseline = await mugshot.check('new');
      expect(resultWhenMissingBaseline.matches).to.be.true;
      expect(await fs.pathExists(baselinePath), "Baseline wasn't written").to.be
        .true;

      await expectIdenticalScreenshots(
        path.join(resultsPath, 'new.png'),
        path.join(__dirname, '../screenshots/simple.png')
      );
    });
  });
});
