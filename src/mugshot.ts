import path from 'path';
import PNGEditor from './interfaces/png-editor';

export interface Result {
  matches: boolean;
}

export interface VisualRegressionTester {
  check: (name: string) => Promise<Result>;
}

export interface Browser {
  // Take a full page screenshot and return a base64 string.
  // https://w3c.github.io/webdriver/#take-screenshot
  takeScreenshot: () => Promise<string>;
}

export interface FileSystem {
  readFile: (name: string) => Promise<Buffer>;
  pathExists: (path: string) => Promise<boolean>;
  writeFile: (path: string, data: Buffer) => Promise<void>;
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
   *   `resultsPath` folder.
   */
  check = async (name: string) => {
    const basePath = path.join(this.resultsPath, `${name}.png`);
    const baseExists = await this.fs.pathExists(basePath);

    if (!baseExists) {
      if (this.writeBaselines) {
        const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
        await this.fs.writeFile(basePath, screenshot);

        return Promise.resolve({ matches: true });
      }

      return Promise.resolve({ matches: false });
    }

    const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
    const base = await this.fs.readFile(basePath);

    return Promise.resolve({
      matches: await this.pngEditor.compare(base, screenshot)
    });
  };
}
