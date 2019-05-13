import path from 'path';
import PNGDiffer from '../interfaces/png-differ';
import Browser from '../interfaces/browser';
import FileSystem from '../interfaces/file-system';

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

// TODO: this is only used in the Mugshot class, should we inline it?
export interface VisualRegressionTester {
  check: (name: string) => Promise<MugshotResult>;
}

export class MugshotMissingBaselineError extends Error {
  constructor() {
    super('Missing baseline');

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, MugshotMissingBaselineError.prototype);
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
  check = async (name: string): Promise<MugshotResult> => {
    const baselinePath = path.join(this.resultsPath, `${name}.png`);
    const baselineExists = await this.fs.pathExists(baselinePath);

    if (!baselineExists) {
      return this.missingBaseline(baselinePath);
    }

    const actual = Buffer.from(await this.browser.takeScreenshot(), 'base64');
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
  };

  private async missingBaseline(baselinePath: string): Promise<MugshotIdenticalResult> {
    if (this.writeBaselines) {
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
