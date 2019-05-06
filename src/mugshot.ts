import path from 'path';
import PNGDiffer from './interfaces/png-differ';
import Browser from './interfaces/browser';
import FileSystem from './interfaces/file-system';

export type MugshotIdenticalResult = {
  // The FS path where the baseline image is stored.
  baselinePath: string;
  // A PNG MIME encoded buffer of the baseline image.
  baseline: Buffer;
};

// TODO: this is only used in the Mugshot class, should we inline it?
export interface VisualRegressionTester {
  check: (name: string) => Promise<MugshotIdenticalResult>;
}

export class MugshotMissingBaselineError extends Error {
  constructor() {
    super('Missing baseline');

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, MugshotMissingBaselineError.prototype);
  }
}

export class MugshotDiffError extends Error {
  // The FS path of the diff image.
  public diffPath: string;

  // A PNG MIME encoded buffer of the diff image.
  public diff: Buffer;

  // The FS path of the actual screenshot.
  public actualPath: string;

  // A PNG MIME encoded buffer of the actual screenshot.
  public actual: Buffer;

  constructor(
    message: string,
    diffPath: string,
    diff: Buffer,
    actualPath: string,
    actual: Buffer
  ) {
    super(message);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, MugshotDiffError.prototype);

    this.diff = diff;
    this.diffPath = diffPath;
    this.actualPath = actualPath;
    this.actual = actual;
  }
}

interface MugshotOptions {
  fs: FileSystem;
  pngDiffer: PNGDiffer;

  /**
   * If set to true `Mugshot.check` will pass if a baseline is not
   * found and it will create the baseline from the screenshot it
   * takes. It is recommended to set this to false when running in
   * CI and to true when running locally.
   */
  createBaselines?: boolean;
}

export default class Mugshot implements VisualRegressionTester {
  private readonly browser: Browser;

  private readonly resultsPath: string;

  private readonly fs: FileSystem;

  private readonly pngDiffer: PNGDiffer;

  private readonly writeBaselines: boolean;

  constructor(
    browser: Browser,
    resultsPath: string,
    { fs, pngDiffer, createBaselines = false }: MugshotOptions
  ) {
    this.browser = browser;
    this.resultsPath = resultsPath;
    this.fs = fs;
    this.pngDiffer = pngDiffer;
    // TODO: use https://www.npmjs.com/package/is-ci
    this.writeBaselines = createBaselines;
  }

  /**
   * Check for visual regressions.
   *
   * @param name Mugshot will look for a baseline named `${name}.png` in the
   *   `resultsPath` folder. If one is not found and `writeBaselines`
   *   is true then Mugshot will create a new baseline and pass the test.
   *   If a baseline is found then it will be compared with the screenshot
   *   taken from `browser`. If differences are found the test will fail
   *   and a `${name}.diff.png` will be created in `resultsPath`.
   */
  check = async (name: string): Promise<MugshotIdenticalResult> => {
    const baselinePath = path.join(this.resultsPath, `${name}.png`);
    const baselineExists = await this.fs.pathExists(baselinePath);

    if (!baselineExists) {
      return this.missingBaseline(baselinePath);
    }

    const actual = Buffer.from(await this.browser.takeScreenshot(), 'base64');
    const baseline = await this.fs.readFile(baselinePath);
    const result = await this.pngDiffer.compare(baseline, actual);

    if (!result.matches) {
      return this.diff(name, result.diff, actual);
    }

    return Promise.resolve({
      baselinePath,
      baseline
    });
  };

  private async missingBaseline(baselinePath: string): Promise<MugshotIdenticalResult> {
    if (this.writeBaselines) {
      const baseline = Buffer.from(await this.browser.takeScreenshot(), 'base64');

      await this.fs.outputFile(baselinePath, baseline);

      return Promise.resolve({
        baselinePath,
        baseline
      });
    }

    return Promise.reject(new MugshotMissingBaselineError());
  }

  private async diff(name: string, diff: Buffer, actual: Buffer) {
    const diffPath = path.join(this.resultsPath, `${name}.diff.png`);
    const actualPath = path.join(this.resultsPath, `${name}.new.png`);

    await this.fs.outputFile(diffPath, diff);
    await this.fs.outputFile(actualPath, actual);

    return Promise.reject(new MugshotDiffError(
      'Visual changes detected',
      diffPath, diff,
      actualPath, actual
    ));
  }
}
