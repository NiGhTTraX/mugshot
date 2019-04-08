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
}

interface MugshotOptions {
  fs: FileSystem;
  pngEditor: PNGEditor;
}

export default class Mugshot implements VisualRegressionTester {
  private readonly browser: Browser;

  private readonly resultsPath: string;

  private readonly fs: FileSystem;

  private readonly pngEditor: PNGEditor;

  constructor(browser: Browser, resultsPath: string, { fs, pngEditor }: MugshotOptions) {
    this.browser = browser;
    this.resultsPath = resultsPath;
    this.fs = fs;
    this.pngEditor = pngEditor;
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
      return Promise.resolve({ matches: false });
    }

    const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
    const base = await this.fs.readFile(basePath);

    return Promise.resolve({
      matches: await this.pngEditor.compare(base, screenshot)
    });
  };
}
