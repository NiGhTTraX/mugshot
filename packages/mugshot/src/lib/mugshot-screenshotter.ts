import Browser from '../interfaces/browser';
import PNGProcessor from '../interfaces/png-processor';
import { MugshotSelector } from './mugshot';
import { Screenshotter } from '../interfaces/screenshotter';

export type ScreenshotOptions = {
  /**
   * The first element identified by this selector will be painted black
   * before taking the screenshot.
   * TODO: ignore all elements
   * TODO: support rects
   */
  ignore?: string;
}

export default class MugshotScreenshotter implements Screenshotter {
  private browser: Browser;

  private pngProcessor: PNGProcessor;

  constructor(browser: Browser, pngProcessor: PNGProcessor) {
    this.browser = browser;
    this.pngProcessor = pngProcessor;
  }

  // eslint-disable-next-line class-methods-use-this
  async takeScreenshot(
    selectorOrOptions?: MugshotSelector | ScreenshotOptions,
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    options: ScreenshotOptions = {}
  ): Promise<Buffer> {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    let selector: string | undefined;

    if (typeof selectorOrOptions === 'string') {
      selector = selectorOrOptions;
    } else if (typeof selectorOrOptions === 'object') {
      // eslint-disable-next-line no-param-reassign
      options = selectorOrOptions;
    }

    return Buffer.from('');
  }
}
