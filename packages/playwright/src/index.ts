/**
 * @module @mugshot/playwright
 */
import { Webdriver } from 'mugshot';
import { ElementHandle, Page } from 'playwright';

/**
 * Adapter over [Playwright](https://github.com/microsoft/playwright) to be
 * used with {@link WebdriverScreenshotter}.
 *
 * @example
 * ```ts
 * import {
 *   Mugshot,
 *   FsStorage,
 *   WebdriverScreenshotter,
 * } from 'mugshot';
 * import { PlaywrightAdapter } from '@mugshot/playwright';
 * import playwright from 'playwright';
 *
 * const browser = await playwright.chromium.launch();
 * const context = await browser.newContext();
 * const page = await context.newPage();
 *
 * const mugshot = new Mugshot(
 *   new WebdriverScreenshotter(
 *     new PlaywrightAdapter(page)
 *   ),
 *   new FsStorage('./screenshots')
 * );
 * ```
 */
export class PlaywrightAdapter implements Webdriver {
  /**
   * @param page The return value of `newPage()`.
   */
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
      return null;
    }

    if (elements.length === 1) {
      return this.getBoundingBox()(elements[0]);
    }

    return Promise.all(elements.map(this.getBoundingBox()));
  };

  setViewportSize = (width: number, height: number) =>
    this.page.setViewportSize({
      width,
      height,
    });

  private getBoundingBox = () => async (element: ElementHandle) => {
    const rect = await element.boundingBox();

    if (!rect) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };
  };
}
