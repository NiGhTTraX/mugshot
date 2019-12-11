import WebdriverIOAdapter from '@mugshot/webdriverio';
import { writeFile } from 'fs-extra';
import { describe, it } from 'tdd-buffet/suite/gui';
import {
  expectIdenticalScreenshots,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserScreenshotter from '../../../src/lib/browser-screenshotter';
import JimpProcessor from '../../../src/lib/jimp-processor';

describe('BrowserScreenshotter', () => {
  it('should disable animations', async browser => {
    await loadFixture(browser, 'animations');

    const screenshotter = new BrowserScreenshotter(
      new WebdriverIOAdapter(browser),
      new JimpProcessor(),
      {
        disableAnimations: true
      }
    );

    const xxx = await screenshotter.takeScreenshot('.animated');
    await writeFile('/tmp/mata.png', xxx);
    await expectIdenticalScreenshots(xxx, 'animations');
  });
});
