/* eslint-disable max-classes-per-file */
import isCI from 'is-ci';
import { Webdriver } from '../interfaces/webdriver';
import { PNGDiffer } from '../interfaces/png-differ';
import { ScreenshotStorage } from '../interfaces/screenshot-storage';
import { Screenshotter, ScreenshotOptions } from '../interfaces/screenshotter';
import { FsStorage } from './fs-storage';
import { PixelDiffer } from './pixel-differ';
import { WebdriverScreenshotter } from './webdriver-screenshotter';

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
 * Identify an element on the screen. Depending on the {@link Screenshotter}
 * implementation this could be a CSS selector, an iOS selector, an Android
 * selector etc.
 *
 * NOTE: This abstraction produces a LISP violation: some {@link Screenshotter}
 * implementations only work with a subset of selectors e.g. CSS selectors
 * or iOS selectors. Fixing this would require inverting the dependency
 * between {@link Mugshot} and {@link Screenshotter}, which I'm not fond of since it
 * moves `Mugshot` one level down. WebdriverIO, for instance, has the same
 * problem; it can talk to Appium which can talk to mobile devices, so using
 * `'div'` as a selector doesn't make sense in that case.
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

export interface MugshotOptions {
  pngDiffer?: PNGDiffer;

  /**
   * If set to `true` then `Mugshot.check` will pass if a baseline is not
   * found, and it will create the baseline from the screenshot it takes.
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

export class Mugshot {
  private readonly pngDiffer: PNGDiffer;

  private readonly storage: ScreenshotStorage;

  private readonly screenshotter: Screenshotter;

  private readonly createMissingBaselines: boolean;

  private readonly updateBaselines: boolean;

  /**
   * Set up Mugshot using sane defaults.
   *
   * If you need more complex options use the "advanced" form of the constructor.
   *
   * @param adapter A {@link Webdriver} implementation to be passed to
   *   {@link WebdriverScreenshotter}. If you need to pass in options to
   *   `WebdriverScreenshotter` then use the "advanced" Mugshot constructor.
   * @param resultsPath A filesystem path where screenshots will be stored
   *   using {@link FsStorage}. If you need to pass in options to `FsStorage`
   *   then use the "advanced" Mugshot constructor.
   * @param options
   */
  constructor(
    adapter: Webdriver,
    resultsPath: string,
    options?: MugshotOptions
  );

  /**
   * Set up Mugshot in "advanced" mode where you can pass in options to the
   * various subsystems or plug in your own.
   *
   * @param screenshotter
   * @param storage
   * @param options
   */
  constructor(
    screenshotter: Screenshotter,
    storage: ScreenshotStorage,
    options?: MugshotOptions
  );

  /**
   * @param screenshotter
   * @param storage How to read and store screenshots.
   * @param createMissingBaselines Defaults to false in a CI env, true otherwise.
   * @param __namedParameters {MugshotOptions}
   */
  constructor(
    screenshotter: Screenshotter | Webdriver,
    storage: ScreenshotStorage | string,
    {
      pngDiffer = new PixelDiffer(),
      createMissingBaselines = !isCI,
      updateBaselines = false,
    }: MugshotOptions = {}
  ) {
    this.pngDiffer = pngDiffer;
    this.createMissingBaselines = createMissingBaselines;
    this.updateBaselines = updateBaselines;

    if (typeof storage === 'string') {
      this.storage = new FsStorage(storage);
      this.screenshotter = new WebdriverScreenshotter(
        screenshotter as Webdriver,
        {
          disableAnimations: true,
        }
      );
    } else {
      this.storage = storage;
      this.screenshotter = screenshotter as Screenshotter;
    }
  }

  /**
   * Check for visual regressions.
   *
   * @param name Mugshot will ask the storage implementation for a baseline
   *   with this name. If one is not found and `createMissingBaselines`
   *   is true then Mugshot will create a new baseline and return a passing
   *   result. Any leftover diffs from last time will be cleaned up.
   *
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `screenshotter`. If differences are found this will return a
   *   failing result and a `${name}.diff` and a `${name}.actual` will be
   *   created using `storage`. If no differences are found then a passing
   *   result will be returned and any leftover diffs from last time will be
   *   cleaned up.
   *
   * @param selector See {@link Screenshotter.takeScreenshot} for more details.
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
   *   result. Any leftover diffs from last time will be cleaned up.
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
      expectedName: name,
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
      expectedName: name,
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
      actualName: `${name}.actual`,
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
