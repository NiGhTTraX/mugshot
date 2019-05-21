import { Browser } from 'mugshot';
import 'webdriverio';

/* istanbul ignore next because this will get stringified and sent to the browser */
function getBoundingRect(selector: string): DOMRect {
  // @ts-ignore because querySelector can be null and we don't
  // care about browsers that don't support it.
  return document.querySelector(selector).getBoundingClientRect();
}

/**
 * API adapter for WebdriverIO to make working with it saner.
 */
export default class WebdriverIOAdapter implements Browser {
  private browser: WebDriver.ClientAsync & WebdriverIOAsync.Browser;

  constructor(browser: WebDriver.ClientAsync & WebdriverIOAsync.Browser) {
    this.browser = browser;
  }

  takeScreenshot = async () => this.browser.takeScreenshot();

  getElementRect = async (selector: string) => {
    // @ts-ignore because the return type is not properly inferred
    const rect: DOMRect = await this.browser.execute(
      getBoundingRect,
      selector
    );

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
  };
}
