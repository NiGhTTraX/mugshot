import WebdriverIOAdapter from '@mugshot/webdriverio';
import { describe, it } from 'tdd-buffet/suite/gui';
import {
  expectIdenticalScreenshots,
  loadFixture,
} from '../../../../../../tests/gui/suite';
import WebdriverScreenshotter from '../../../../src/lib/webdriver-screenshotter';

describe('WebdriverScreenshotter', () => {
  it('should disable animations', async (browser) => {
    await loadFixture(browser, 'animations');

    const screenshotter = new WebdriverScreenshotter(
      new WebdriverIOAdapter(browser),
      {
        disableAnimations: true,
      }
    );

    await expectIdenticalScreenshots(
      await screenshotter.takeScreenshot('.animated'),
      'animations'
    );
  });
});
