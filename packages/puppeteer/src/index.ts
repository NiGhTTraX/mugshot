import { Browser, ElementNotFoundError } from 'mugshot';
import { Page } from 'puppeteer';

/**
 * Webdriver adapter over [Puppeteer](https://github.com/puppeteer/puppeteer).
 */
export default class PuppeteerAdapter implements Browser {
  constructor(private readonly page: Page) {}

  getElementRect = async (selector: string) => {
    const elements = await this.page.$$(selector);

    if (!elements.length) {
      throw new ElementNotFoundError(selector);
    }

    const rects = await Promise.all(
      elements.map(
        async element =>
          (await element.boundingBox()) || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          }
      )
    );

    return rects.length === 1 ? rects[0] : rects;
  };

  setViewportSize = (width: number, height: number) =>
    this.page.setViewport({
      width,
      height
    });

  takeScreenshot = () => this.page.screenshot();
}
