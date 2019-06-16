import { describe, it } from '../../../../../tests/gui/suite';
import WebdriverIOAdapter from '../../../src/lib/webdriverio-adapter';
import createTests from '@mugshot/browser-tests';

describe('WebdriverIOAdapter', () => {
  createTests().forEach(test => {
    it(test.name, async browser => test.getTest(browser, new WebdriverIOAdapter(browser)));
  });
});
