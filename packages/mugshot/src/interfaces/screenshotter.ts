import { MugshotSelector } from '../lib/mugshot';

export interface ScreenshotOptions {
  /**
   * All elements identified by this selector will be painted black
   * before taking the screenshot.
   * TODO: support rects
   * TODO: configure the color
   */
  ignore?: string;
}

/**
 * Thrown when the selector passed to [[Mugshot.check]] matches more than one
 * element.
 */
export class TooManyElementsError extends Error {
  constructor(selector: MugshotSelector) {
    super(`More than 1 elements matches ${selector}.

You can only take a screenshot of one element. Please narrow down your selector.`);
  }
}

export default interface Screenshotter {
  /**
   * Take a viewport screenshot.
   */
  takeScreenshot(options?: ScreenshotOptions): Promise<Buffer>;

  /**
   * Take a screenshot of a single element.
   *
   * Will throw [[TooManyElementsError]] if `selector` matches more than one element.
   *
   * @see [[TooManyElementsError]]
   */
  takeScreenshot(
    selector: MugshotSelector,
    options?: ScreenshotOptions
  ): Promise<Buffer>;
}
