import { Webdriver } from 'mugshot';
import { Page } from 'puppeteer';

/**
 * Webdriver adapter over [Puppeteer](https://github.com/puppeteer/puppeteer)
 * to be used with [[WebdriverScreenshotter]].
 *
 * @see https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md
 */
export default class PuppeteerAdapter implements Webdriver {
  constructor(private readonly page: Page) {}

  getElementRect = async (selector: string) => {
    const elements = await this.page.$$(selector);

    if (!elements.length) {
      return null;
    }

    const rects = await Promise.all(
      elements.map(async (element) => {
        const rect = await element.boundingBox();

        if (!rect) {
          return { x: 0, y: 0, width: 0, height: 0 };
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

  takeScreenshot = async () =>
    // The puppeteer type returns Buffer | string depending on the encoding,
    // but does not discriminate on it. It can also return void if the screenshot
    // fails.
    (await (this.page.screenshot() as Promise<Buffer>)).toString('base64');

  execute = <R, A extends any[]>(func: (...args: A) => R, ...args: A) =>
    this.page.evaluate(
      // @ts-expect-error the puppeteer type expects at least 1 argument
      func,
      ...args
    );
}
