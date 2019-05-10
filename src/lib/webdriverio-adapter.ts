import Browser from '../interfaces/browser';

/**
 * API adapter for WebdriverIO to make working with it saner.
 */
export default class WebdriverIOAdapter implements Browser {
  private browser: WebDriver.ClientAsync & WebdriverIOAsync.Browser;

  constructor(browser: WebDriver.ClientAsync & WebdriverIOAsync.Browser) {
    this.browser = browser;
  }

  takeScreenshot = async () => this.browser.takeScreenshot();
}
