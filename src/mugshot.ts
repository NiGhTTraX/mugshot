import path from 'path';
import PNGDiffer from './interfaces/png-differ';
import Browser from './interfaces/browser';
import FileSystem from './interfaces/file-system';

export type MugshotResult = {
  matches: true;
};

export interface VisualRegressionTester {
  check: (name: string) => Promise<MugshotResult>;
}

export class MugshotError extends Error {
  /**
   * A PNG MIME encoded buffer of the diff image.
   */
  public diff?: Buffer;

  constructor(message: string, diff?: Buffer) {
    super(message);

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, MugshotError.prototype);

    this.diff = diff;
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
    const basePath = path.join(this.resultsPath, `${name}.png`);
    const baseExists = await this.fs.pathExists(basePath);

    if (!baseExists) {
      if (this.writeBaselines) {
        const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
        await this.fs.outputFile(basePath, screenshot);

        return Promise.resolve({ matches: true });
      }

      return Promise.reject(new MugshotError('Missing baseline'));
    }

    const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
    const base = await this.fs.readFile(basePath);

    const result = await this.pngDiffer.compare(base, screenshot);

    if (!result.matches) {
      await this.fs.outputFile(
        path.join(this.resultsPath, `${name}.diff.png`),
        result.diff
      );

      await this.fs.outputFile(
        path.join(this.resultsPath, `${name}.new.png`),
        screenshot
      );

      return Promise.reject(new MugshotError('Visual changes detected', result.diff));
    }

    return Promise.resolve(result);
  };
}
