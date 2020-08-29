import {
  ElementNotFoundError,
  ElementNotVisibleError,
  Webdriver,
} from 'mugshot';
import { Page } from 'playwright';

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
      // TODO: extract a function for this
      const rect = await elements[0].boundingBox();
      if (!rect) {
        throw new ElementNotVisibleError(selector);
      }
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }

    return Promise.all(
      elements.map(async (element) => {
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
      })
    );
  };

  setViewportSize(width: number, height: number) {
    return this.page.setViewportSize({ width, height });
  }
}
