import { MugshotSelector } from '../lib/mugshot';
import { ScreenshotOptions } from '../lib/mugshot-screenshotter';

export interface Screenshotter {
  getScreenshot(options?: ScreenshotOptions): Promise<Buffer>;

  getScreenshot(selector?: MugshotSelector, options?: ScreenshotOptions): Promise<Buffer>;

  getScreenshot(
    selectorOrOptions?: MugshotSelector | ScreenshotOptions,
    options: ScreenshotOptions
  ): Promise<Buffer>;
}
