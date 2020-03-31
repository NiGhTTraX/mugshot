import {
  Webdriver,
  ElementNotFoundError,
  ElementNotVisibleError,
} from 'mugshot';
import { Page } from 'puppeteer';

/**
 * Webdriver adapter over [Puppeteer](https://github.com/puppeteer/puppeteer)
 * to be used with [[WebdriverScreenshotter].
 *
 * @see https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md
 */
export default class PuppeteerAdapter implements Webdriver {
  constructor(private readonly page: Page) {}

  getElementRect = async (selector: string) => {
    const elements = await this.page.$$(selector);

    if (!elements.length) {
      throw new ElementNotFoundError(selector);
    }

    const rects = await Promise.all(
      elements.map(async (element) => {
        const rect = await element.boundingBox();

        if (!rect) {
          throw new ElementNotVisibleError(selector);
        }

        return rect;
      })
    );

    return rects.length === 1 ? rects[0] : rects;
  };

  setViewportSize = (width: number, height: number) =>
    this.page.setViewport({
      width,
      height,
    });

  takeScreenshot = () => this.page.screenshot();

  execute = <R>(func: (...args: any[]) => R, ...args: any[]) =>
    this.page.evaluate(func, ...args);
}
