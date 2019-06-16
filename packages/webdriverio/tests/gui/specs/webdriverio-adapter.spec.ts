import { describe, it } from '../../../../../tests/gui/suite';
import WebdriverIOAdapter from '../../../src/lib/webdriverio-adapter';
import browserContractTests from '@mugshot/browser-contract';

describe('WebdriverIOAdapter', () => {
  browserContractTests.forEach(test => {
    it(test.name, async browser => test.getTest(browser, new WebdriverIOAdapter(browser)));
  });
});
