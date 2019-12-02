import { expect } from 'chai';
import Jimp from 'jimp';
import { Browser, ElementNotFound } from 'mugshot';
import { fixtures } from './fixtures';

/**
 * Methods on the browser instance that these tests need.
 *
 * They're different from the ones from mugshot/browser because
 * the tests are concerned with navigating the browser to test
 * fixtures.
 */
export interface TestBrowser {
  /**
   * Navigate to an URL.
   */
  url: (path: string) => Promise<any>;

  /**
   * Execute JS in the active page.
   *
   * @param func Should be stringified and sent to the browser.
   * @param args Should be stringified and passed to func.
   */
  execute: (func: (...args: any[]) => any, ...args: any[]) => Promise<any>;
}

export type BrowserContractTest = {
  name: string;

  /**
   * Get the test implementation that will throw an `AssertionError` on failure.
   *
   * @param browser The browser you're adapting. It will be used to navigate to
   *   a test fixture and resize the window.
   * @param adapter The browser adapter.
   */
  getTest: (browser: TestBrowser, adapter: Browser) => () => Promise<void>;
};

/* istanbul ignore next because this will get stringified and sent to the browser */
function createFixture(html: string) {
  // This should use `document.write` instead but Firefox gives an "insecure operation" error.
  document.body.innerHTML = html;
}

async function loadFixture(
  browser: TestBrowser,
  adapter: Browser,
  name: keyof typeof fixtures
) {
  const fixtureContent = fixtures[name];

  await browser.url('about:blank');

  await browser.execute(createFixture, fixtureContent);

  await adapter.setViewportSize(1024, 768);
}

export const browserContractTests: BrowserContractTest[] = [
  {
    name: 'should take a viewport screenshot',
    getTest(browser: TestBrowser, adapter: Browser) {
      return async () => {
        await loadFixture(browser, adapter, 'simple');

        const screenshot = await Jimp.read(
          Buffer.from(await adapter.takeScreenshot(), 'base64')
        );

        expect(screenshot.getWidth()).to.equal(1024);
        expect(screenshot.getHeight()).to.equal(768);
      };
    }
  },
  {
    name:
      'should take a viewport screenshot with absolutely positioned elements',
    getTest(browser: TestBrowser, adapter: Browser) {
      return async () => {
        await loadFixture(browser, adapter, 'rect');

        const screenshot = await Jimp.read(
          Buffer.from(await adapter.takeScreenshot(), 'base64')
        );

        expect(screenshot.getWidth()).to.equal(1024);
        expect(screenshot.getHeight()).to.equal(768);
      };
    }
  },
  {
    name: 'should get bounding rect of element',
    getTest(browser: TestBrowser, adapter: Browser) {
      return async () => {
        await loadFixture(browser, adapter, 'rect');

        const rect = await adapter.getElementRect('.test');

        expect(rect).to.deep.equal({
          // Include margin.
          x: 8 + 3,
          y: 10 + 3,
          // Include border and padding.
          width: 100 + 2 * 2 + 4 * 2,
          height: 100 + 2 * 2 + 4 * 2
        });
      };
    }
  },
  {
    name: 'should get bounding rect of off-screen element',
    getTest(browser: TestBrowser, adapter: Browser) {
      return async () => {
        await loadFixture(browser, adapter, 'rect-scroll');

        const rect = await adapter.getElementRect('.test');

        expect(rect).to.deep.equal({
          x: 2000,
          y: 2000,
          width: 100,
          height: 100
        });
      };
    }
  },
  {
    name: 'should get bounding rect of missing element',
    getTest(browser: TestBrowser, adapter: Browser) {
      return async () => {
        await loadFixture(browser, adapter, 'rect-scroll');

        let caughtError!: ElementNotFound;

        try {
          await adapter.getElementRect('.missing');
        } catch (e) {
          caughtError = e;
        }

        expect(caughtError).to.be.instanceOf(ElementNotFound);
        expect(caughtError.message).to.contain('.missing');
      };
    }
  },
  {
    name: 'should get bounding rect of all matching elements',
    getTest(browser, adapter) {
      return async () => {
        await loadFixture(browser, adapter, 'rect-multiple');

        expect(await adapter.getElementRect('.multiple')).to.deep.equal([
          { x: 0, y: 0, width: 100, height: 100 },
          { x: 100, y: 0, width: 100, height: 100 },
          { x: 0, y: 100, width: 100, height: 100 },
          { x: 100, y: 100, width: 100, height: 100 }
        ]);
      };
    }
  }
];
