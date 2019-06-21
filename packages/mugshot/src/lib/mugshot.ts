import path from 'path';
import fsExtra from 'fs-extra';
import isCI from 'is-ci';
import PNGDiffer from '../interfaces/png-differ';
import Browser from '../interfaces/browser';
import FileSystem from '../interfaces/file-system';
import PNGProcessor from '../interfaces/png-processor';
import Screenshotter, { ScreenshotOptions } from '../interfaces/screenshotter';
import JimpProcessor from './jimp-processor';
import PixelDiffer from './pixel-differ';
import MugshotScreenshotter from './mugshot-screenshotter';

export type MugshotIdenticalResult = {
  matches: true;
  // The FS path where the baseline image is stored.
  expectedPath: string;
  // A PNG MIME encoded buffer of the baseline image.
  expected: Buffer;
};

export type MugshotDiffResult = {
  matches: false;
  // A PNG MIME encoded buffer of the baseline image.
  expected: Buffer;
  // A PNG MIME encoded buffer of the actual screenshot.
  actual: Buffer;
  // A PNG MIME encoded buffer of the diff image.
  diff: Buffer;
  // The FS path of the baseline image.
  expectedPath: string;
  // The FS path of the actual screenshot.
  actualPath: string;
  // The FS path of the diff image.
  diffPath: string;
};

export type MugshotResult = MugshotIdenticalResult | MugshotDiffResult;

export type MugshotSelector = string;

interface MugshotOptions {
  fs?: FileSystem;
  pngDiffer?: PNGDiffer;
  pngProcessor?: PNGProcessor;
  screenshotter?: Screenshotter;

  /**
   * If set to true `Mugshot.check` will pass if a baseline is not
   * found and it will create the baseline from the screenshot it
   * takes.
   */
  createMissingBaselines?: boolean;

  /**
   * When set to true Mugshot will overwrite any existing baselines
   * and will create missing ones (equivalent to setting
   * `createMissingBaselines: true`).
   */
  updateBaselines?: boolean;
}

export class MugshotMissingBaselineError extends Error {
  constructor() {
    super('Missing baseline');

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, MugshotMissingBaselineError.prototype);
  }
}

export default class Mugshot {
  private readonly browser: Browser;

  private readonly resultsPath: string;

  private readonly fs: FileSystem;

  private readonly pngDiffer: PNGDiffer;

  private readonly pngProcessor: PNGProcessor;

  private readonly screenshotter: Screenshotter;

  private readonly createMissingBaselines: boolean;

  private updateBaselines: boolean;

  /**
   * @param browser
   * @param resultsPath
   * @param fs
   * @param pngDiffer
   * @param pngProcessor
   * @param screenshotter
   * @param createMissingBaselines Defaults to false in a CI env, true otherwise.
   * @param updateBaselines
   */
  constructor(
    browser: Browser,
    resultsPath: string,
    {
      fs = fsExtra,
      pngDiffer = new PixelDiffer(),
      pngProcessor = new JimpProcessor(),
      screenshotter = new MugshotScreenshotter(browser, pngProcessor),
      createMissingBaselines = !isCI,
      updateBaselines = false
    }: MugshotOptions = {}
  ) {
    this.browser = browser;
    this.resultsPath = resultsPath;
    this.fs = fs;
    this.pngDiffer = pngDiffer;
    this.pngProcessor = pngProcessor;
    this.screenshotter = screenshotter;
    this.createMissingBaselines = createMissingBaselines;
    this.updateBaselines = updateBaselines;
  }

  /**
   * Check for visual regressions.
   *
   * @param name Mugshot will look for a baseline named `${name}.png` in the
   *   `resultsPath` folder. If one is not found and `createMissingBaselines`
   *   is true then Mugshot will create a new baseline and pass the test. <br>
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `browser`. If differences are found the test will fail
   *   and a `${name}.diff.png` will be created in `resultsPath`.
   *
   * @param selector If given then Mugshot will screenshot the visible
   *   region bounded by the element's rectangle. <br>
   *   If the element is not in the viewport then, depending on the
   *   browser WebDriver implementation, a screenshot might fail.
   *   It is up to you to appropriately scroll the viewport
   *   before calling Mugshot. <br>
   *   If the element is not found an error will be thrown.
   *
   * @param options
   */
  // eslint-disable-next-line max-len
  check(name: string, selector: MugshotSelector, options?: ScreenshotOptions): Promise<MugshotResult>;
  // eslint-disable-next-line no-dupe-class-members,lines-between-class-members
  check(name: string, options?: ScreenshotOptions): Promise<MugshotResult>;
  // eslint-disable-next-line lines-between-class-members,no-dupe-class-members
  async check(
    name: string,
    selectorOrOptions?: MugshotSelector | ScreenshotOptions,
    options: ScreenshotOptions = {}
  ): Promise<MugshotResult> {
    let selector: MugshotSelector | undefined;

    if (typeof selectorOrOptions === 'string') {
      selector = selectorOrOptions;
    } else if (typeof selectorOrOptions === 'object') {
      // eslint-disable-next-line no-param-reassign
      options = selectorOrOptions;
    }

    const expectedPath = path.join(this.resultsPath, `${name}.png`);
    const baselineExists = await this.fs.pathExists(expectedPath);

    if (!baselineExists) {
      if (this.createMissingBaselines || this.updateBaselines) {
        return this.writeBaseline(expectedPath, options, selector);
      }

      throw new MugshotMissingBaselineError();
    } else if (this.updateBaselines) {
      return this.writeBaseline(expectedPath, options, selector);
    }

    const actual = await this.getScreenshot(selector, options);

    const expected = await this.fs.readFile(expectedPath);
    const result = await this.pngDiffer.compare(expected, actual);

    if (!result.matches) {
      return this.diff(name, expectedPath, expected, result.diff, actual);
    }

    return {
      matches: true,
      expected,
      expectedPath
    };
  }

  private async writeBaseline(
    expectedPath: string,
    options: ScreenshotOptions,
    selector?: MugshotSelector
  ): Promise<MugshotIdenticalResult> {
    const expected = await this.getScreenshot(selector, options);

    await this.fs.outputFile(expectedPath, expected);

    return {
      matches: true,
      expected,
      expectedPath
    };
  }

  private async diff(
    name: string,
    expectedPath: string,
    expected: Buffer,
    diff: Buffer,
    actual: Buffer
  ): Promise<MugshotDiffResult> {
    const diffPath = path.join(this.resultsPath, `${name}.diff.png`);
    const actualPath = path.join(this.resultsPath, `${name}.actual.png`);

    await this.fs.outputFile(diffPath, diff);
    await this.fs.outputFile(actualPath, actual);

    return {
      matches: false,
      expected,
      actual,
      diff,
      expectedPath,
      diffPath,
      actualPath
    };
  }

  private async getScreenshot(selector: MugshotSelector | undefined, options: ScreenshotOptions) {
    return selector
      // TODO: because WebStorm really wants it
      // eslint-disable-next-line no-return-await
      ? await this.screenshotter.takeScreenshot(selector, options)
      // eslint-disable-next-line no-return-await
      : await this.screenshotter.takeScreenshot(options);
  }
}
