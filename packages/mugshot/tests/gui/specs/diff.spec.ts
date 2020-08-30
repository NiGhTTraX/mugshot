import PuppeteerAdapter from '@mugshot/puppeteer';
import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it, afterEach } from 'tdd-buffet/suite/node';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverScreenshotter from '../../../src/lib/webdriver-screenshotter';
import {
  createResultsDirWithBaseline,
  expectIdenticalScreenshots,
  loadFixture,
} from '../helpers';

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
      await loadFixture(page, 'simple2');

      const diffPath = path.join(resultsPath, 'simple.diff.png');

      const mugshot = new Mugshot(
        new WebdriverScreenshotter(new PuppeteerAdapter(page)),
        new FsStorage(resultsPath),
        {
          createMissingBaselines: true,
        }
      );

      await mugshot.check('simple');

      expect(await fs.pathExists(diffPath), "Diff wasn't written").to.be.true;

      await expectIdenticalScreenshots(
        diffPath,
        'simple.diff',
        `The written diff ${diffPath} doesn't match expected one`
      );
    });
  });
});
