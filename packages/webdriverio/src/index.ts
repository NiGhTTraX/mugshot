import { Browser, ElementNotFoundError } from 'mugshot';
import 'webdriverio';
import { ElementNotVisibleError } from 'mugshot/src/interfaces/browser';

/* istanbul ignore next because this will get stringified and sent to the browser */
function getBoundingRect(selector: string): DOMRect | DOMRect[] | null {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return null;
  }

  if (elements.length === 1) {
    return elements[0].getBoundingClientRect() as DOMRect;
  }

  return Array.from(elements).map(
    element => element.getBoundingClientRect() as DOMRect
  );
}

/* istanbul ignore next because this will get stringified and sent to the browser */
function getBrowserChromeSize() {
  return {
    width: window.outerWidth - window.innerWidth,
    height: window.outerHeight - window.innerHeight
  };
}

/**
 * Adapter over [WebdriverIO](https://webdriver.io/) to be used with
 * [[BrowserScreenshotter]].
 *
 * @see https://webdriver.io/docs/api.html
 */
export default class WebdriverIOAdapter implements Browser {
  constructor(
    private readonly browser: WebDriver.ClientAsync & WebdriverIOAsync.Browser
  ) {}

  takeScreenshot = async () => this.browser.takeScreenshot();

  getElementRect = async (selector: string) => {
    const rects = (await this.browser.execute(getBoundingRect, selector)) as
      | DOMRect
      | DOMRect[]
      | null;

    if (!rects) {
      throw new ElementNotFoundError(selector);
    }

    if (Array.isArray(rects)) {
      return rects.map(rect => {
        if (
          rect.x === 0 &&
          rect.y === 0 &&
          rect.width === 0 &&
          rect.height === 0
        ) {
          throw new ElementNotVisibleError(selector);
        }

        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        };
      });
    }

    if (
      rects.x === 0 &&
      rects.y === 0 &&
      rects.width === 0 &&
      rects.height === 0
    ) {
      throw new ElementNotVisibleError(selector);
    }

    return {
      x: rects.x,
      y: rects.y,
      width: rects.width,
      height: rects.height
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
    } catch (e) {}
  };

  execute = <R>(func: (...args: any[]) => R, ...args: any[]) =>
    this.browser.execute<R>(func, ...args);
}
