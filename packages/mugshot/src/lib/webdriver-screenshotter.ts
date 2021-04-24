import { PNGProcessor } from '../interfaces/png-processor';
import {
  ScreenshotOptions,
  Screenshotter,
  TooManyElementsError,
} from '../interfaces/screenshotter';
import {
  ElementNotFoundError,
  ElementNotVisibleError,
  Webdriver,
} from '../interfaces/webdriver';
import { JimpProcessor } from './jimp-processor';
import { ElementRect, MugshotSelector } from './mugshot';

export interface WebdriverScreenshotterOptions {
  pngProcessor?: PNGProcessor;

  /**
   * Disable any CSS animations that might cause test flakiness.
   */
  disableAnimations?: boolean;
}

/* istanbul ignore next because this will be stringified and executed in the client */
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
 * Take screenshots from a Webdriver compatible client.
 */
export class WebdriverScreenshotter implements Screenshotter {
  private readonly pngProcessor: PNGProcessor;

  private readonly disableAnimations: boolean;

  /**
   * @param client
   * @param __namedParameters {@link WebdriverScreenshotterOptions}
   */
  constructor(
    private readonly client: Webdriver,
    {
      pngProcessor = new JimpProcessor(),
      disableAnimations = false,
    }: WebdriverScreenshotterOptions = {}
  ) {
    this.pngProcessor = pngProcessor;
    this.disableAnimations = disableAnimations;
  }

  /**
   * Take screenshots of selectors by first taking a viewport screenshot and
   * then cropping the element out.
   *
   * The element's bounding rectangle will be used to crop it out of the
   * viewport screenshot.
   */
  async takeScreenshot(
    selectorOrOptions?: MugshotSelector | ScreenshotOptions,
    options: ScreenshotOptions = {}
  ): Promise<Buffer> {
    let selector: MugshotSelector | undefined;

    if (
      typeof selectorOrOptions === 'string' ||
      (typeof selectorOrOptions !== 'undefined' && 'x' in selectorOrOptions)
    ) {
      selector = selectorOrOptions;
    } else if (typeof selectorOrOptions === 'object') {
      // eslint-disable-next-line no-param-reassign
      options = selectorOrOptions;
    }

    if (this.disableAnimations) {
      await this.client.execute(injectAnimationDisablingStylesheet);
    }

    let screenshot = Buffer.from(
      await this.client.takeViewportScreenshot(),
      'base64'
    );

    if (selector) {
      screenshot = await this.crop(selector, screenshot);
    }

    if (options.ignore) {
      screenshot = await this.ignore(
        options.ignore,
        screenshot,
        options.ignoreColor
      );
    }

    return screenshot;
  }

  private async crop(selector: MugshotSelector, screenshot: Buffer) {
    let rect: ElementRect | ElementRect[] | null;

    if (typeof selector !== 'string') {
      rect = selector;
    } else {
      rect = await this.client.getElementRect(selector);

      if (!rect) {
        throw new ElementNotFoundError(selector);
      }

      if (Array.isArray(rect)) {
        throw new TooManyElementsError(selector);
      }

      if (rect.width === 0 || rect.height === 0) {
        throw new ElementNotVisibleError(selector);
      }
    }

    return this.pngProcessor.crop(
      screenshot,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
  }

  private async ignore(
    selector: MugshotSelector,
    screenshot: Buffer,
    ignoreColor = '#000'
  ) {
    let rects: ElementRect | ElementRect[] | null;

    if (typeof selector === 'string') {
      rects = await this.client.getElementRect(selector);

      if (!rects) {
        throw new ElementNotFoundError(selector);
      }

      if (Array.isArray(rects)) {
        rects.forEach((rect) => {
          if (rect.width === 0 || rect.height === 0) {
            throw new ElementNotVisibleError(selector);
          }
        });
      } else if (rects.width === 0 || rects.height === 0) {
        throw new ElementNotVisibleError(selector);
      }
    } else {
      rects = selector;
    }

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
          ignoreColor
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
      ignoreColor
    );
  }
}
