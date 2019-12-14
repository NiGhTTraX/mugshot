import WebdriverIOAdapter from '@mugshot/webdriverio';
import { describe, it } from 'tdd-buffet/suite/gui';
import {
  expectIdenticalScreenshots,
  loadFixture
} from '../../../../../tests/gui/suite';
import BrowserScreenshotter from '../../../src/lib/browser-screenshotter';

describe('BrowserScreenshotter', () => {
  it('should disable animations', async browser => {
    await loadFixture(browser, 'animations');

    const screenshotter = new BrowserScreenshotter(
      new WebdriverIOAdapter(browser),
      {
        disableAnimations: true
      }
    );

    await expectIdenticalScreenshots(
      await screenshotter.takeScreenshot('.animated'),
      'animations'
    );
  });
});
