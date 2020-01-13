/* eslint-disable max-classes-per-file */
import isCI from 'is-ci';
import PNGDiffer from '../interfaces/png-differ';
import ScreenshotStorage from '../interfaces/screenshot-storage';
import Screenshotter, { ScreenshotOptions } from '../interfaces/screenshotter';
import PixelDiffer from './pixel-differ';

export interface MugshotIdenticalResult {
  matches: true;
  /**
   * The name of the baseline.
   */
  expectedName: string;
  /**
   * A PNG MIME encoded buffer of the baseline image.
   */
  expected: Buffer;
}

export interface MugshotDiffResult {
  matches: false;
  /**
   * A PNG MIME encoded buffer of the baseline image.
   */
  expected: Buffer;
  /**
   * A PNG MIME encoded buffer of the actual screenshot.
   */
  actual: Buffer;
  /**
   * A PNG MIME encoded buffer of the diff image.
   */
  diff: Buffer;
  /**
   * The name of the baseline.
   */
  expectedName: string;
  /**
   * The name of the actual screenshot.
   */
  actualName: string;
  /**
   * The name of the diff image.
   */
  diffName: string;
}

export type MugshotResult = MugshotIdenticalResult | MugshotDiffResult;

/**
 * Uniquely identify an element on the screen according to the [[Screenshotter]]
 * implementation.
 *
 * TODO: this abstraction is leaky - [[Mugshot.check]] doesn't do anything with
 * this type other than pass it to [[Screenshotter.takeScreenshot]]. It also
 * produces a LISP violation: [[Mugshot.check]] accepts a very generic `string`
 * type, but a [[Screenshotter.takeScreenshot]] implementation could only want
 * to accept a subset e.g. CSS selectors. Ideally, the dependency would be
 * inverted - you would pass a [[Mugshot]] instance to a [[Screenshotter]
 * instance, but I don't like that since it takes away the focus from Mugshot.
 */
export type ElementSelector = string;

/**
 * Identify a rectangle on the screen relative to the top left corner (0, 0).
 *
 * The `x` and `y` properties are named like that instead of `left` and `top`
 * (that would match `width` and `height` in style) because it's meant to
 * align with the builtin `DOMRect` type.
 */
export interface ElementRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type MugshotSelector = ElementSelector | ElementRect;

interface MugshotOptions {
  pngDiffer?: PNGDiffer;

  /**
   * If set to `true` then `Mugshot.check` will pass if a baseline is not
   * found and it will create the baseline from the screenshot it
   * takes.
   */
  createMissingBaselines?: boolean;

  /**
   * When set to `true` then `Mugshot.check` will overwrite any existing baselines
   * and will create missing ones (implies setting
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
   * @param createMissingBaselines Defaults to false in a CI env, true otherwise.
   * @param __namedParameters [[MugshotOptions]]
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
   *   is true then Mugshot will create a new baseline and return a passing
   *   result. Any leftover diffs from last time will be cleaned up.<br>
   *
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `screenshotter`. If differences are found this will return a
   *   failing result and a `${name}.diff` and a `${name}.actual` will be
   *   created using `storage`. If no differences are found then a passing
   *   result will be returned and any leftover diffs from last time will be
   *   cleaned up.
   *
   * @param selector See [[Screenshotter.takeScreenshot]] for more details.
   *
   * @param options
   */
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
   *   is true then Mugshot will create a new baseline and return a passing
   *   result. Any leftover diffs from last time will be cleaned up.<br>
   *
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `screenshotter`. If differences are found this will return a
   *   failing result and a `${name}.diff` and a `${name}.actual` will be
   *   created using `storage`. If no differences are found then a passing
   *   result will be returned and any leftover diffs from last time will be
   *   cleaned up.
   *
   * @param options
   */
  // eslint-disable-next-line no-dupe-class-members
  check(name: string, options?: ScreenshotOptions): Promise<MugshotResult>;

  // eslint-disable-next-line no-dupe-class-members
  async check(
    name: string,
    selectorOrOptions?: MugshotSelector | ScreenshotOptions,
    options: ScreenshotOptions = {}
  ): Promise<MugshotResult> {
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

    await this.cleanup(name);

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
    await this.cleanup(name);

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
      ? this.screenshotter.takeScreenshot(selector, options)
      : this.screenshotter.takeScreenshot(options);
  }

  private cleanup = async (name: string) => {
    await this.storage.delete(`${name}.diff`);
    await this.storage.delete(`${name}.actual`);
  };
}
