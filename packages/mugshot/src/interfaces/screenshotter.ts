/* eslint-disable semi */
import { MugshotSelector } from '../lib/mugshot';

export type ScreenshotOptions = {
  /**
   * The first element identified by this selector will be painted black
   * before taking the screenshot.
   * TODO: ignore all elements
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
