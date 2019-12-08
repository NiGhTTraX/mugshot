import isCI from 'is-ci';
import PNGDiffer from '../interfaces/png-differ';
import ScreenshotStorage from '../interfaces/screenshot-storage';
import Screenshotter, { ScreenshotOptions } from '../interfaces/screenshotter';
import PixelDiffer from './pixel-differ';

export type MugshotIdenticalResult = {
  matches: true;
  // The name of the baseline.
  expectedName: string;
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
  // The name of the baseline.
  expectedName: string;
  // The name of the actual screenshot.
  actualName: string;
  // The name of the diff image.
  diffName: string;
};

export type MugshotResult = MugshotIdenticalResult | MugshotDiffResult;

export type MugshotSelector = string;

interface MugshotOptions {
  pngDiffer?: PNGDiffer;

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
  constructor(name: string) {
    super(`Missing baseline for ${name}`);
  }
}

export default class Mugshot {
  private readonly pngDiffer: PNGDiffer;

  private readonly createMissingBaselines: boolean;

  private readonly updateBaselines: boolean;

  /**
   * @param screenshotter
   * @param storage How to read and store screenshots.
   * @param pngDiffer
   * @param createMissingBaselines Defaults to false in a CI env, true otherwise.
   * @param updateBaselines
   */
  constructor(
    private readonly screenshotter: Screenshotter,
    private readonly storage: ScreenshotStorage,
    {
      pngDiffer = new PixelDiffer(),
      createMissingBaselines = !isCI,
      updateBaselines = false
    }: MugshotOptions = {}
  ) {
    this.pngDiffer = pngDiffer;
    this.createMissingBaselines = createMissingBaselines;
    this.updateBaselines = updateBaselines;
  }

  /**
   * Check for visual regressions.
   *
   * @param name Mugshot will ask the storage implementation for a baseline
   *   with this name. If one is not found and `createMissingBaselines`
   *   is true then Mugshot will create a new baseline and pass the test. <br>
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `screenshotter`. If differences are found this will return a
   *   failing result and a `${name}.diff` and a `${name}.actual` will be
   *   created using `storage`.
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
  check(
    name: string,
    selector: MugshotSelector,
    options?: ScreenshotOptions
  ): Promise<MugshotResult>;
  /**
   * Check for visual regressions.
   *
   * @param name Mugshot will ask the storage implementation for a baseline
   *   with this name. If one is not found and `createMissingBaselines`
   *   is true then Mugshot will create a new baseline and pass the test. <br>
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `screenshotter`. If differences are found this will return a
   *   failing result and a `${name}.diff` and a `${name}.actual` will be
   *   created using `storage`.
   *
   * @param options
   */

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

    const baselineExists = await this.storage.exists(name);

    if (!baselineExists) {
      if (this.createMissingBaselines || this.updateBaselines) {
        return this.writeBaseline(name, options, selector);
      }

      throw new MugshotMissingBaselineError(name);
    } else if (this.updateBaselines) {
      return this.writeBaseline(name, options, selector);
    }

    const actual = await this.getScreenshot(selector, options);

    const expected = await this.storage.read(name);
    const result = await this.pngDiffer.compare(expected, actual);

    if (!result.matches) {
      return this.diff(name, expected, result.diff, actual);
    }

    return {
      matches: true,
      expected,
      expectedName: name
    };
  }

  private async writeBaseline(
    name: string,
    options: ScreenshotOptions,
    selector?: MugshotSelector
  ): Promise<MugshotIdenticalResult> {
    const expected = await this.getScreenshot(selector, options);

    await this.storage.write(name, expected);

    return {
      matches: true,
      expected,
      expectedName: name
    };
  }

  private async diff(
    name: string,
    expected: Buffer,
    diff: Buffer,
    actual: Buffer
  ): Promise<MugshotDiffResult> {
    await this.storage.write(`${name}.diff`, diff);
    await this.storage.write(`${name}.actual`, actual);

    return {
      matches: false,
      expected,
      actual,
      diff,
      expectedName: name,
      diffName: `${name}.diff`,
      actualName: `${name}.actual`
    };
  }

  private async getScreenshot(
    selector: MugshotSelector | undefined,
    options: ScreenshotOptions
  ) {
    return selector
      ? // TODO: because WebStorm really wants it
        // eslint-disable-next-line no-return-await
        await this.screenshotter.takeScreenshot(selector, options)
      : // eslint-disable-next-line no-return-await
        await this.screenshotter.takeScreenshot(options);
  }
}
