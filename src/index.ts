export interface Result {
  matches: boolean;
}

export interface VisualRegressionTester {
  check: (name: string) => Promise<Result>;
}

export interface Browser {
  takeScreenshot: () => Promise<string>;
}

export interface FileSystem {
  read: (name: string) => Promise<string>;
  write: (name: string) => Promise<string>;
}

export default class Mugshot implements VisualRegressionTester {
  private browser: Browser;

  private fs: FileSystem;

  constructor(browser: Browser, storage: FileSystem) {
    this.browser = browser;
    this.fs = storage;
  }

  check = async (name: string) => {
    const screenshot = await this.browser.takeScreenshot();
    const base = await this.fs.read(name);

    return Promise.resolve({ matches: screenshot === base });
  };
}
