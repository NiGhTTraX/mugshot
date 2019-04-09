import path from 'path';
import PNGEditor from './interfaces/png-editor';

export type MugshotResult = {
  matches: true;
} | {
  matches: false;
  diff: Buffer;
}

export interface VisualRegressionTester {
  check: (name: string) => Promise<MugshotResult>;
}

export interface Browser {
  // Take a full page screenshot and return a base64 string.
  // https://w3c.github.io/webdriver/#take-screenshot
  takeScreenshot: () => Promise<string>;
}

export interface FileSystem {
  readFile: (name: string) => Promise<Buffer>;
  pathExists: (path: string) => Promise<boolean>;

  /**
   * (Over)write a file and create its parent folder structure if missing.
   */
  outputFile: (path: string, data: Buffer) => Promise<void>;
}

interface MugshotOptions {
  fs: FileSystem;
  pngEditor: PNGEditor;

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

  private readonly pngEditor: PNGEditor;

  private readonly writeBaselines: boolean;

  /**
   *
   * @param browser WHAT
   * @param resultsPath
   * @param fs
   * @param pngEditor
   * @param createBaselines
   */
  constructor(
    browser: Browser,
    resultsPath: string,
    { fs, pngEditor, createBaselines = false }: MugshotOptions
  ) {
    this.browser = browser;
    this.resultsPath = resultsPath;
    this.fs = fs;
    this.pngEditor = pngEditor;
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

      return Promise.resolve({ matches: false, diff: Buffer.from('') });
    }

    const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
    const base = await this.fs.readFile(basePath);

    const result = await this.pngEditor.compare(base, screenshot);

    if (!result.matches) {
      await this.fs.outputFile(
        path.join(this.resultsPath, `${name}.diff.png`),
        result.diff
      );

      await this.fs.outputFile(
        path.join(this.resultsPath, `${name}.new.png`),
        screenshot
      );
    }

    return Promise.resolve(result);
  };
}
