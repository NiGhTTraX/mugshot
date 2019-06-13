import path from 'path';
import fsExtra from 'fs-extra';
import PNGDiffer from '../interfaces/png-differ';
import Browser from '../interfaces/browser';
import FileSystem from '../interfaces/file-system';
import PNGProcessor from '../interfaces/png-processor';
import JimpProcessor from './jimp-processor';
import pixelDiffer from './pixel-differ';

export type MugshotIdenticalResult = {
  matches: true;
  // The FS path where the baseline image is stored.
  baselinePath: string;
  // A PNG MIME encoded buffer of the baseline image.
  baseline: Buffer;
};

export type MugshotDiffResult = {
  matches: false;
  // The FS path of the baseline image.
  baselinePath: string;
  // A PNG MIME encoded buffer of the baseline image.
  baseline: Buffer;
  // The FS path of the diff image.
  diffPath: string;
  // A PNG MIME encoded buffer of the diff image.
  diff: Buffer;
  // The FS path of the actual screenshot.
  actualPath: string;
  // A PNG MIME encoded buffer of the actual screenshot.
  actual: Buffer;
};

export type MugshotResult = MugshotIdenticalResult | MugshotDiffResult;

export type MugshotSelector = string;

export type MugshotCheckOptions = {
  /**
   * The first element identified by this selector will be painted black
   * before taking the screenshot.
   * TODO: ignore all elements
   * TODO: support rects
   */
  ignore?: string;
}

interface MugshotOptions {
  fs?: FileSystem;
  pngDiffer?: PNGDiffer;
  pngProcessor?: PNGProcessor;
  /**
   * If set to true `Mugshot.check` will pass if a baseline is not
   * found and it will create the baseline from the screenshot it
   * takes. It is recommended to set this to `false` when running in
   * CI and to `true` when running locally.
   */
  createMissingBaselines?: boolean;
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

  private readonly createBaselines: boolean;

  constructor(
    browser: Browser,
    resultsPath: string,
    {
      fs = fsExtra,
      pngDiffer = pixelDiffer,
      pngProcessor = new JimpProcessor(),
      createMissingBaselines = false
    }: MugshotOptions = {}
  ) {
    this.browser = browser;
    this.resultsPath = resultsPath;
    this.fs = fs;
    this.pngDiffer = pngDiffer;
    this.pngProcessor = pngProcessor;
    // TODO: use https://www.npmjs.com/package/is-ci
    this.createBaselines = createMissingBaselines;
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
  check(name: string, selector: MugshotSelector, options?: MugshotCheckOptions): Promise<MugshotResult>;
  // eslint-disable-next-line no-dupe-class-members,lines-between-class-members
  check(name: string, options?: MugshotCheckOptions): Promise<MugshotResult>;
  // eslint-disable-next-line lines-between-class-members,no-dupe-class-members
  async check(
    name: string,
    selectorOrOptions?: any,
    maybeOptions?: any
  ): Promise<MugshotResult> {
    let selector: string | undefined;
    let options: MugshotCheckOptions = {};

    if (typeof selectorOrOptions === 'string') {
      selector = selectorOrOptions;

      if (maybeOptions) {
        options = maybeOptions;
      }
    } else if (typeof selectorOrOptions === 'object') {
      options = selectorOrOptions;
    }

    const baselinePath = path.join(this.resultsPath, `${name}.png`);
    const baselineExists = await this.fs.pathExists(baselinePath);

    if (!baselineExists) {
      return this.missingBaseline(baselinePath);
    }

    let actual = Buffer.from(await this.browser.takeScreenshot(), 'base64');

    if (options.ignore) {
      const ignoreRect = await this.browser.getElementRect(options.ignore);
      actual = await this.pngProcessor.setColor(actual, ignoreRect.x, ignoreRect.y, ignoreRect.width, ignoreRect.height, '#000');
    }

    if (selector) {
      const rect = await this.browser.getElementRect(selector);
      actual = await this.pngProcessor.crop(actual, rect.x, rect.y, rect.width, rect.height);
    }

    const baseline = await this.fs.readFile(baselinePath);
    const result = await this.pngDiffer.compare(baseline, actual);

    if (!result.matches) {
      return this.diff(name, baselinePath, baseline, result.diff, actual);
    }

    return {
      matches: true,
      baselinePath,
      baseline
    };
  }

  private async missingBaseline(baselinePath: string): Promise<MugshotIdenticalResult> {
    if (this.createBaselines) {
      const baseline = Buffer.from(await this.browser.takeScreenshot(), 'base64');

      await this.fs.outputFile(baselinePath, baseline);

      return {
        matches: true,
        baselinePath,
        baseline
      };
    }

    throw new MugshotMissingBaselineError();
  }

  private async diff(
    name: string,
    baselinePath: string,
    baseline: Buffer,
    diff: Buffer,
    actual: Buffer
  ): Promise<MugshotDiffResult> {
    const diffPath = path.join(this.resultsPath, `${name}.diff.png`);
    const actualPath = path.join(this.resultsPath, `${name}.new.png`);

    await this.fs.outputFile(diffPath, diff);
    await this.fs.outputFile(actualPath, actual);

    return {
      matches: false,
      baselinePath,
      baseline,
      diffPath,
      diff,
      actualPath,
      actual
    };
  }
}
