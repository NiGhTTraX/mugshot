import WebdriverIOAdapter from '@mugshot/webdriverio';
import { expect } from 'tdd-buffet/expect/chai';
import { beforeEach, describe, it } from 'tdd-buffet/suite/gui';
import {
  createResultsDirWithBaseline,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserViewportCropScreenshotter from '../../../src/lib/browser-viewport-crop-screenshotter';
import FsStorage from '../../../src/lib/fs-storage';
import JimpProcessor from '../../../src/lib/jimp-processor';
import Mugshot from '../../../src/lib/mugshot';

describe('Mugshot', () => {
  let resultsPath!: string;

  beforeEach(async () => {
    resultsPath = await createResultsDirWithBaseline('simple');
  });

  it('should pass when identical', async browser => {
    await loadFixture(browser, 'simple');

    const mugshot = new Mugshot(
      new BrowserViewportCropScreenshotter(
        new WebdriverIOAdapter(browser),
        new JimpProcessor()
      ),
      new FsStorage(resultsPath)
    );

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.true;
  });

  it('should fail when different', async browser => {
    await loadFixture(browser, 'simple2');

    const mugshot = new Mugshot(
      new BrowserViewportCropScreenshotter(
        new WebdriverIOAdapter(browser),
        new JimpProcessor()
      ),
      new FsStorage(resultsPath)
    );

    const result = await mugshot.check('simple');

    expect(result.matches).to.be.false;
  });
});
