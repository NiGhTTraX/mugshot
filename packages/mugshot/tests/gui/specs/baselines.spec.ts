import PuppeteerAdapter from '@mugshot/puppeteer';
import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { expect } from 'tdd-buffet/expect/chai';
import { afterEach, beforeEach, describe, it } from 'tdd-buffet/suite/node';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverScreenshotter from '../../../src/lib/webdriver-screenshotter';
import { expectIdenticalScreenshots, loadFixture } from '../helpers';

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
      await loadFixture(page, 'simple');

      const baselinePath = path.join(resultsPath, 'new.png');

      const mugshot = new Mugshot(
        new WebdriverScreenshotter(new PuppeteerAdapter(page)),
        new FsStorage(resultsPath),
        {
          createMissingBaselines: true,
        }
      );

      const resultWhenMissingBaseline = await mugshot.check('new');
      expect(resultWhenMissingBaseline.matches).to.be.true;
      expect(await fs.pathExists(baselinePath), "Baseline wasn't written").to.be
        .true;

      await expectIdenticalScreenshots(
        path.join(resultsPath, 'new.png'),
        'simple',
        `The written baseline ${baselinePath} doesn't match expected one`
      );
    });

    it('should create parent folders when writing baseline', async () => {
      await loadFixture(page, 'simple');

      const mugshot = new Mugshot(
        new WebdriverScreenshotter(new PuppeteerAdapter(page)),
        new FsStorage(resultsPath),
        {
          createMissingBaselines: true,
        }
      );

      await mugshot.check('foo/bar/new');

      expect(
        await fs.pathExists(path.join(resultsPath, 'foo/bar')),
        "Baseline folder structure wasn't created"
      ).to.be.true;
    });
  });
});
