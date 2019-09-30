import { Browser, ElementNotFound } from 'mugshot';
import 'webdriverio';

/* istanbul ignore next because this will get stringified and sent to the browser */
function getBoundingRect(selector: string): DOMRect | null {
  const element = document.querySelector(selector);

  if (!element) {
    return null;
  }

  return element.getBoundingClientRect() as DOMRect;
}

/* istanbul ignore next because this will get stringified and sent to the browser */
function getBrowserChromeSize() {
  return {
    width: window.outerWidth - window.innerWidth,
    height: window.outerHeight - window.innerHeight
  };
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

  setViewportSize = async (width: number, height: number) => {
    const {
      // @ts-ignore because the return type is not properly inferred
      width: chromeWidth,
      // @ts-ignore
      height: chromeHeight
    } = await this.browser.execute(getBrowserChromeSize);

    const actualWidth = width + chromeWidth;
    const actualHeight = height + chromeHeight;

    // Chrome...
    await this.browser.setWindowSize(actualWidth, actualHeight);

    // Firefox...
    try {
      await this.browser.setWindowRect(0, 0, actualWidth, actualHeight);
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  };
}
