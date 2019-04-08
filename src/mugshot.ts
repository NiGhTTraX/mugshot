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
}

interface MugshotOptions {
  fs: FileSystem;
  pngEditor: PNGEditor;
}

export default class Mugshot implements VisualRegressionTester {
  private browser: Browser;

  private fs: FileSystem;

  private pngEditor: PNGEditor;

  constructor(browser: Browser, { fs, pngEditor }: MugshotOptions) {
    this.browser = browser;
    this.fs = fs;
    this.pngEditor = pngEditor;
  }

  check = async (name: string) => {
    const screenshot = Buffer.from(await this.browser.takeScreenshot(), 'base64');
    const base = await this.fs.readFile(name);

    return Promise.resolve({
      matches: await this.pngEditor.compare(base, screenshot)
    });
  };
}
