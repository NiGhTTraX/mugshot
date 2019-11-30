import Browser from '../interfaces/browser';
import PNGProcessor from '../interfaces/png-processor';
import Screenshotter, { ScreenshotOptions } from '../interfaces/screenshotter';
import { MugshotSelector } from './mugshot';

/**
 * Take screenshots of selectors by first taking a viewport screenshot and then cropping
 * the element out.
 */
export default class BrowserScreenshotter implements Screenshotter {
  constructor(
    private readonly browser: Browser,
    private readonly pngProcessor: PNGProcessor
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

    return this.pngProcessor.crop(
      screenshot,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
  }

  private async ignore(selector: MugshotSelector, screenshot: Buffer) {
    const rect = await this.browser.getElementRect(selector);

    return this.pngProcessor.paint(
      screenshot,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      '#000'
    );
  }
}
