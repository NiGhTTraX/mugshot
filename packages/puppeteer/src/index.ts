/**
 * @module @mugshot/puppeteer
 */
import { Webdriver } from 'mugshot';
import { Page } from 'puppeteer';

/**
 * Webdriver adapter over [Puppeteer](https://github.com/puppeteer/puppeteer)
 * to be used with {@link WebdriverScreenshotter}.
 *
 * @example
 * ```ts
 * import { Mugshot } from 'mugshot';
 * import { PuppeteerAdapter } from '@mugshot/puppeteer';
 * import puppeteer from 'puppeteer';
 *
 * const browser = await puppeteer.launch();
 * const page = await browser.newPage();
 *
 * const mugshot = new Mugshot(
 *   new PuppeteerAdapter(page),
 *   './screenshots'
 * );
 * ```
 */
export class PuppeteerAdapter implements Webdriver {
  /**
   * @param page The return value of `newPage()`.
   */
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

  takeViewportScreenshot = async () =>
    // The puppeteer type returns Buffer | string depending on the encoding,
    // but does not discriminate on it. It can also return void if the screenshot
    // fails.
    (await (this.page.screenshot() as Promise<Buffer>)).toString('base64');

  execute = <R, A extends unknown[]>(func: (...args: A) => R, ...args: A) =>
    this.page.evaluate(
      // @ts-expect-error because the puppeteer type maps over A and does some funky stuff
      func,
      ...args
    ) as Promise<R>; // needed because we're suppressing an error above
}
