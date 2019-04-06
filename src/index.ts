export interface Result {
  matches: boolean;
}

export interface VisualRegressionTester {
  check: (name: string) => Promise<Result>;
}

export interface Browser {
  // https://w3c.github.io/webdriver/#take-screenshot
  takeScreenshot: () => Promise<string>;
}

export interface FileSystem {
  read: (name: string) => Promise<string>;
}

export interface Differ {
  compare: (a: string, b: string) => Promise<boolean>;
}

interface MugshotOptions {
  fs: FileSystem;
  differ: Differ;
}

export default class Mugshot implements VisualRegressionTester {
  private browser: Browser;

  private fs: FileSystem;

  private differ: Differ;

  constructor(browser: Browser, { fs, differ }: MugshotOptions) {
    this.browser = browser;
    this.fs = fs;
    this.differ = differ;
  }

  check = async (name: string) => {
    const screenshot = await this.browser.takeScreenshot();
    const base = await this.fs.read(name);

    return Promise.resolve({
      matches: await this.differ.compare(base, screenshot)
    });
  };
}
