import { Fixture, loadFixture } from '@mugshot/contracts';
import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { afterEach } from 'tdd-buffet/suite/node';
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

  describe('ignore', () => {
    let resultsPath!: string;

    beforeEach(async () => {
      resultsPath = await createResultsDirWithBaseline('ignore');
    });

    it('should ignore an element', async () => {
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

      const result = await mugshot.check('ignore', { ignore: 'div' });

      expect(result.matches).to.be.true;
    });
  });
});
