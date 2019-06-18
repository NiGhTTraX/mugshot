import { Browser } from 'mugshot';
import 'webdriverio';
import { ElementNotFound } from 'mugshot/src/interfaces/browser';

/* istanbul ignore next because this will get stringified and sent to the browser */
function getBoundingRect(selector: string): DOMRect | null {
  const element = document.querySelector(selector);

  if (!element) {
    return null;
  }

  return element.getBoundingClientRect() as DOMRect;
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
    const rect: DOMRect | null = await this.browser.execute(
      getBoundingRect,
      selector
    ) as DOMRect | null;

    if (!rect) {
      throw new ElementNotFound(selector);
    }

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
  };
}
