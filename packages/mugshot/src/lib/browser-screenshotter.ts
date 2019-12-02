import Browser from '../interfaces/browser';
import PNGProcessor from '../interfaces/png-processor';
import Screenshotter, { ScreenshotOptions } from '../interfaces/screenshotter';
import JimpProcessor from './jimp-processor';
import { MugshotSelector } from './mugshot';

/**
 * Take screenshots of selectors by first taking a viewport screenshot and then cropping
 * the element out.
 */
export default class BrowserScreenshotter implements Screenshotter {
  constructor(
    private readonly browser: Browser,
    private readonly pngProcessor: PNGProcessor = new JimpProcessor()
  ) {}

  async takeScreenshot(
    selectorOrOptions?: MugshotSelector | ScreenshotOptions,
    options: ScreenshotOptions = {}
  ): Promise<Buffer> {
    let selector: MugshotSelector | undefined;

    if (typeof selectorOrOptions === 'string') {
      selector = selectorOrOptions;
    } else if (typeof selectorOrOptions === 'object') {
      // eslint-disable-next-line no-param-reassign
      options = selectorOrOptions;
    }

    let screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');

    if (selector) {
      screenshot = await this.crop(selector, screenshot);
    }

    if (options.ignore) {
      screenshot = await this.ignore(options.ignore, screenshot);
    }

    return screenshot;
  }

  private async crop(selector: MugshotSelector, screenshot: Buffer) {
    const rect = await this.browser.getElementRect(selector);

    if (Array.isArray(rect)) {
      throw new Error(/* TODO */);
    }

    return this.pngProcessor.crop(
      screenshot,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
  }

  private async ignore(selector: MugshotSelector, screenshot: Buffer) {
    const rects = await this.browser.getElementRect(selector);

    if (Array.isArray(rects)) {
      let result: Buffer = screenshot;

      // eslint-disable-next-line no-restricted-syntax
      for (const rect of rects) {
        // eslint-disable-next-line no-await-in-loop
        result = await this.pngProcessor.paint(
          result,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          '#000'
        );
      }

      return result;
    }

    return this.pngProcessor.paint(
      screenshot,
      rects.x,
      rects.y,
      rects.width,
      rects.height,
      '#000'
    );
  }
}
