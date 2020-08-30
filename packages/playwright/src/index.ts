import {
  ElementNotFoundError,
  ElementNotVisibleError,
  Webdriver,
} from 'mugshot';
import { ElementHandle, Page } from 'playwright';

/**
 * Adapter over [Playwright](https://github.com/microsoft/playwright) to be
 * used with [[WebdriverScreenshotter]].
 *
 * @see https://playwright.dev/
 */
export default class PlaywrightAdapter implements Webdriver {
  constructor(private readonly page: Page) {}

  takeScreenshot = async () =>
    (await this.page.screenshot()).toString('base64');

  execute = <R, A extends any[]>(
    func: (...args: A) => R,
    ...args: A
  ): Promise<R> =>
    this.page.evaluate(
      // @ts-expect-error because playwright has a weird conditional type for args
      func,
      ...args
    );

  getElementRect = async (selector: string) => {
    const elements = await this.page.$$(selector);

    if (!elements.length) {
      throw new ElementNotFoundError(selector);
    }

    if (elements.length === 1) {
      return this.getBoundingBox(selector)(elements[0]);
    }

    return Promise.all(elements.map(this.getBoundingBox(selector)));
  };

  setViewportSize = (width: number, height: number) =>
    this.page.setViewportSize({
      width,
      height,
    });

  private getBoundingBox = (selector: string) => async (
    element: ElementHandle
  ) => {
    const rect = await element.boundingBox();

    if (!rect) {
      throw new ElementNotVisibleError(selector);
    }

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };
  };
}
