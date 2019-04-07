import { remote } from 'webdriverio';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import {
  runnerAfter,
  runnerBefore,
  runnerBeforeEach,
  runnerIt,
  runnerDescribe
} from '../mocha-runner';
// import Browser = WebdriverIOAsync.Browser;

export { expect };

type Browser = ReturnType<typeof remote>;
export type TestDefinition = (browser: Browser) => Promise<any> | void;

const { BROWSER = 'chrome', SELENIUM_HOST = 'localhost' } = process.env;

let suiteNesting = 0;
// These will hold root suite level instances. Since most, if not all test
// runners run tests inside of a suite sequentially and since we only set

// up the browser once per root test suite, these should be "thread safe".
let rootSuiteBrowser: Browser;

export async function loadFixture(name: string) {
  await rootSuiteBrowser.url(`file:///var/www/html/${name}.html`);
  await rootSuiteBrowser.setWindowSize(1024, 768);
}
/**
 * Run your gui tests in a fresh Selenium session.
 *
 * Nested calls will preserve the root session.
 *
 * Tests and hooks will receive the browser instance.
 */
export function describe(name: string, definition: () => void) {
  suiteNesting++;

  runnerDescribe(name, function() {
    // We only want to set up hooks once - for the root suite.
    suiteNesting === 1 && setupHooks();

    definition();
  });

  suiteNesting--;
}

export function beforeEach(definition: TestDefinition) {
  runnerBeforeEach(function() {
    return definition(rootSuiteBrowser);
  });
}

/**
 * Run a test with optional coverage report.
 */
export function it(name: string, definition: TestDefinition = () => {}) {
  runnerIt(name, testName => {
    const promise = Promise.resolve(definition(rootSuiteBrowser));

    if (!process.env.COVERAGE) {
      return promise;
    }

    return promise.then(() => collectCoverage(testName));
  });
}

/**
 * @param {string} testName
 */
function collectCoverage(testName: string): Promise<void> {
  const safeTestName = getSafeFilename(testName);

  return Promise.resolve(rootSuiteBrowser.execute(function getCoverage() {
    // @ts-ignore because `__coverage__` is added by nyc
    return JSON.stringify(window.__coverage__);
  })).then(coverage => {
    fs.writeFileSync(
      path.join(__dirname, 'results', 'coverage', `${BROWSER}_${safeTestName}.json`),
      coverage
    );
  });
}

function getSafeFilename(fileName: string): string {
  return fileName
    .replace(/\//g, '_')
    .replace(/ /g, '_')
    .toLowerCase();
}

function setupHooks() {
  runnerBefore(async function connectToSelenium() {
    const options: WebDriver.Options = {
      hostname: SELENIUM_HOST,
      capabilities: { browserName: BROWSER },
      logLevel: 'error'
    };

    rootSuiteBrowser = await remote(options);

    return rootSuiteBrowser;
  });

  runnerAfter(function endSession() {
    return rootSuiteBrowser.deleteSession();
  });
}
