import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { afterEach } from 'tdd-buffet/suite/node';
import FsStorage from '../../../src/lib/fs-storage';
import Mugshot from '../../../src/lib/mugshot';
import WebdriverScreenshotter from '../../../src/lib/webdriver-screenshotter';
import { createResultsDirWithBaseline, loadFixture } from '../helpers';

describe('Mugshot', () => {
  let resultsPath!: string;
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    resultsPath = await createResultsDirWithBaseline('simple');
  });

  it('should pass when identical', async () => {
    await loadFixture(page, 'simple');

    const mugshot = new Mugshot(
      new WebdriverScreenshotter(new PuppeteerAdapter(page)),
      new FsStorage(resultsPath)
    );

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async () => {
    await loadFixture(page, 'simple2');

    const mugshot = new Mugshot(
      new WebdriverScreenshotter(new PuppeteerAdapter(page)),
      new FsStorage(resultsPath)
    );

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.false;
  });
});
