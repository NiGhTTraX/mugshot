import { webdriverContractTests } from '@mugshot/contracts';
import { describe, it } from 'tdd-buffet/suite/gui';
import {
  expectIdenticalScreenshots,
  loadFixture
} from '../../../tests/gui/suite';
import WebdriverIOAdapter from '../src';

describe('WebdriverIOAdapter', () => {
  webdriverContractTests.forEach(test => {
    it(test.name, browser =>
      test.run(browser, new WebdriverIOAdapter(browser))
    );
  });

  it('should take a full page screenshot', async browser => {
    await loadFixture(browser, 'simple');

    const clientAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(
      await clientAdapter.takeScreenshot(),
      'base64'
    );

    await expectIdenticalScreenshots(screenshot, 'simple');
  });

  it('should take a full page screenshot with absolutely positioned elements', async browser => {
    await loadFixture(browser, 'rect');

    const clientAdapter = new WebdriverIOAdapter(browser);
    const screenshot = Buffer.from(
      await clientAdapter.takeScreenshot(),
      'base64'
    );

    await expectIdenticalScreenshots(screenshot, 'full-absolute');
  });
});
