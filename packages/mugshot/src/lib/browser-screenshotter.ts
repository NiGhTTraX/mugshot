import Browser from '../interfaces/browser';
import PNGProcessor from '../interfaces/png-processor';
import Screenshotter, {
  ScreenshotOptions,
  TooManyElementsError
} from '../interfaces/screenshotter';
import JimpProcessor from './jimp-processor';
import { MugshotSelector } from './mugshot';

export interface BrowserScreenshotterOptions {
  /**
   * Disable any CSS animations that might cause test flakiness.
   */
  disableAnimations?: boolean;
}

/* istanbul ignore next because this will be stringified and executed in the browser */
function injectAnimationDisablingStylesheet() {
  const style = document.createElement('style');
  style.textContent = `
input {
  caret-color: transparent;
}

*, *::before, *::after {
  transition: none !important;
  animation: none !important;
}
        `;
  document.head.appendChild(style);
}

/**
 * Take screenshots from a Webdriver compatible browser.
 */
export default class BrowserScreenshotter implements Screenshotter {
  private readonly disableAnimations: boolean;

  constructor(
    private readonly browser: Browser,
    private readonly pngProcessor: PNGProcessor = new JimpProcessor(),
    { disableAnimations = false }: BrowserScreenshotterOptions = {}
  ) {
    this.disableAnimations = disableAnimations;
  }

  /**
   * Take screenshots of selectors by first taking a viewport screenshot and
   * then cropping the element out.
   *
   * The element's bounding rectangle will be used to crop it out of the
   * viewport screenshot. If the element is not fully visible in the viewport
   */
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

    if (this.disableAnimations) {
      await this.browser.execute(injectAnimationDisablingStylesheet);
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
      throw new TooManyElementsError(selector);
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
