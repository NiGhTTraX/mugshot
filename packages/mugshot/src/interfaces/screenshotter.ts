import { MugshotSelector } from '../lib/mugshot';
import { ScreenshotOptions } from '../lib/mugshot-screenshotter';

export interface Screenshotter {
  /**
   * Take a viewport screenshot.
   */
  takeScreenshot(options?: ScreenshotOptions): Promise<Buffer>;

  /**
   * Take a screenshot of an element.
   */
  takeScreenshot(selector?: MugshotSelector, options?: ScreenshotOptions): Promise<Buffer>;
}
