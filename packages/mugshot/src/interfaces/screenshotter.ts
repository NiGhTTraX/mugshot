/* eslint-disable semi */
import { MugshotSelector } from '../lib/mugshot';

export type ScreenshotOptions = {
  /**
   * All elements identified by this selector will be painted black
   * before taking the screenshot.
   * TODO: support rects
   */
  ignore?: string;
};

export default interface Screenshotter {
  /**
   * Take a viewport screenshot.
   */
  takeScreenshot(options?: ScreenshotOptions): Promise<Buffer>;

  /**
   * Take a screenshot of an element.
   */
  takeScreenshot(
    selector?: MugshotSelector,
    options?: ScreenshotOptions
  ): Promise<Buffer>;
}
