import { Webdriver } from 'mugshot';
import 'webdriverio';

/* istanbul ignore next because this will get stringified and sent to the client */
function getBoundingRect(selector: string): DOMRect | DOMRect[] | null {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return null;
  }

  if (elements.length === 1) {
    return elements[0].getBoundingClientRect() as DOMRect;
  }

  return Array.from(elements).map(
    (element) => element.getBoundingClientRect() as DOMRect
  );
}

/* istanbul ignore next because this will get stringified and sent to the client */
function getClientChromeSize() {
  return {
    width: window.outerWidth - window.innerWidth,
    height: window.outerHeight - window.innerHeight,
  };
}

/**
 * Adapter over [WebdriverIO](https://webdriver.io/) to be used with
 * [[WebdriverScreenshotter]].
 *
 * @see https://webdriver.io/docs/api.html
 */
export default class WebdriverIOAdapter implements Webdriver {
  constructor(
    private readonly client: WebDriver.ClientAsync & WebdriverIOAsync.Browser
  ) {}

  takeScreenshot = async () => this.client.takeScreenshot();

  getElementRect = async (selector: string) => {
    const rects = (await this.client.execute(getBoundingRect, selector)) as
      | DOMRect
      | DOMRect[]
      | null;

    if (!rects) {
      return null;
    }

    if (Array.isArray(rects)) {
      return rects.map((rect) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }));
    }

    return {
      x: rects.x,
      y: rects.y,
      width: rects.width,
      height: rects.height,
    };
  };

  setViewportSize = async (width: number, height: number) => {
    const {
      width: chromeWidth,
      height: chromeHeight,
    } = await this.client.execute(getClientChromeSize);

    const actualWidth = width + chromeWidth;
    const actualHeight = height + chromeHeight;

    // Chrome...
    await this.client.setWindowSize(actualWidth, actualHeight);

    // Firefox...
    try {
      await this.client.setWindowRect(0, 0, actualWidth, actualHeight);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

  execute = <R, A extends any[]>(func: (...args: A) => R, ...args: A) =>
    // @ts-expect-error because webdriver doesn't use a generic for args
    this.client.execute<R>(func, ...args);
}
