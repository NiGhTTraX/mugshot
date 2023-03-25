/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { readFileSync } from 'fs';
import Jimp from 'jimp';
import { Webdriver } from 'mugshot';
import { join } from 'path';
import { expectIdenticalScreenshots } from './helpers';

/**
 * Help the tests set up the environment.
 *
 * This is different from {@link Webdriver} because these methods are only
 * needed by the tests.
 */
export interface WebdriverTestSetup {
  /**
   * Navigate to an URL.
   */
  url: (path: string) => Promise<unknown>;
}

export interface WebdriverContractTest {
  name: string;

  /**
   * Run the test which will throw an `AssertionError` on failure.
   *
   * @param client The client you're adapting. It will be used to navigate to
   *   a test fixture.
   * @param adapter The client adapter.
   */
  run: (client: WebdriverTestSetup, adapter: Webdriver) => Promise<void>;
}

/* istanbul ignore next because this will get stringified and sent to the client */
function createFixture(html: string) {
  // This should use `document.write` instead but Firefox gives an "insecure operation" error.
  document.body.innerHTML = html;
}

export enum Fixture {
  animations = 'animations',
  rect = 'rect',
  rectInvisible = 'rect-invisible',
  rectMultiple = 'rect-multiple',
  rectScroll = 'rect-scroll',
  rgby = 'rgby',
  simple = 'simple',
  simple2 = 'simple2',
}

export async function loadFixture(
  client: WebdriverTestSetup,
  adapter: Webdriver,
  name: Fixture
) {
  const fixtureContent = readFileSync(
    join(__dirname, `fixtures/${name}.html`),
    { encoding: 'utf8' }
  );

  await client.url('about:blank');

  await adapter.execute(createFixture, fixtureContent);

  await adapter.setViewportSize(1024, 768);
}

export const webdriverExecuteContractTests: WebdriverContractTest[] = [
  {
    name: 'should execute a simple function',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.simple);

      /* istanbul ignore next because this will get stringified and sent to the client */
      const func = () => 23;

      expect(await adapter.execute(func)).to.equal(23);
    },
  },
  {
    name: 'should execute a simple function with args',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.simple);

      /* istanbul ignore next because this will get stringified and sent to the client */
      const func = (x: number) => x;

      expect(await adapter.execute(func, 42)).to.equal(42);
    },
  },
];

export const webdriverViewportContractTests: WebdriverContractTest[] = [
  {
    name: 'should take a viewport screenshot',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.simple);

      const screenshot = await Jimp.read(
        Buffer.from(await adapter.takeViewportScreenshot(), 'base64')
      );

      expect(screenshot.getWidth()).to.equal(1024);
      expect(screenshot.getHeight()).to.equal(768);
    },
  },
  {
    name: 'should take a viewport screenshot with absolutely positioned elements',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rect);

      const screenshot = await Jimp.read(
        Buffer.from(await adapter.takeViewportScreenshot(), 'base64')
      );

      expect(screenshot.getWidth()).to.equal(1024);
      expect(screenshot.getHeight()).to.equal(768);
    },
  },
];

export const webdriverGetElementRectContractTests: WebdriverContractTest[] = [
  {
    name: 'should get bounding rect of element',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rect);

      const rect = await adapter.getElementRect('.test');

      expect(rect).to.deep.equal({
        // Include margin.
        x: 8 + 3,
        y: 10 + 3,
        // Include border and padding.
        width: 100 + 2 * 2 + 4 * 2,
        height: 100 + 2 * 2 + 4 * 2,
      });
    },
  },
  {
    name: 'should get bounding rect of off-screen element',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rectScroll);

      const rect = await adapter.getElementRect('.test');

      expect(rect).to.deep.equal({
        x: 2000,
        y: 2000,
        width: 100,
        height: 100,
      });
    },
  },
  {
    name: 'should return null if element is missing',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rectScroll);

      expect(await adapter.getElementRect('.missing')).to.be.null;
    },
  },
  {
    name: 'should get bounding rect of all matching elements',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rectMultiple);

      expect(await adapter.getElementRect('.multiple')).to.deep.equal([
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 100, y: 0, width: 100, height: 100 },
        { x: 0, y: 100, width: 100, height: 100 },
        { x: 100, y: 100, width: 100, height: 100 },
      ]);
    },
  },
  {
    name: 'should return 0,0,0,0 if the element is not visible',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rectInvisible);

      expect(await adapter.getElementRect('#invisible1')).to.deep.equal({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    },
  },
  {
    name: 'should return 0,0,0,0 for every invisible element',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rectInvisible);

      expect(await adapter.getElementRect('.invisible')).to.deep.equal([
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
      ]);
    },
  },
  {
    name: 'should return visible and invisible elements',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rectInvisible);

      expect(await adapter.getElementRect('div')).to.deep.equal([
        {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        },
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
        {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
      ]);
    },
  },
];

export const webdriverTakeScreenshotContractTests: WebdriverContractTest[] = [
  {
    name: 'should take a full page screenshot',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.simple);

      const screenshot = Buffer.from(
        await adapter.takeViewportScreenshot(),
        'base64'
      );

      await expectIdenticalScreenshots(
        screenshot,
        join(__dirname, `screenshots/simple.png`)
      );
    },
  },
  {
    name: 'should take a full page screenshot with absolutely positioned elements',
    run: async (client, adapter) => {
      await loadFixture(client, adapter, Fixture.rect);

      const screenshot = Buffer.from(
        await adapter.takeViewportScreenshot(),
        'base64'
      );

      await expectIdenticalScreenshots(
        screenshot,
        join(__dirname, `screenshots/full-absolute.png`)
      );
    },
  },
];

/**
 * Contract tests for the {@link Webdriver} interface.
 *
 * Each key represents a suite of tests. Check the docs for each to understand
 * their scope.
 */
export const webdriverContractSuites: Record<string, WebdriverContractTest[]> =
  {
    /**
     * This suite checks the {@link Webdriver.getElementRect} method
     * and is __mandatory__ for implementations to pass.
     */
    getElementRect: webdriverGetElementRectContractTests,

    /**
     * This suite checks the {@link Webdriver.execute} method and is
     * __mandatory__ for implementations to pass.
     */
    execute: webdriverExecuteContractTests,

    /**
     * This suite checks that {@link Webdriver.takeViewportScreenshot} and
     * {@link Webdriver.setViewportSize} works as expected when setting and getting the
     * viewport size and is __mandatory__ for implementations to pass
     */
    setViewportSize: webdriverViewportContractTests,

    /**
     * This suite check the {@link Webdriver.takeViewportScreenshot} method and is _optional_
     * for implementations to pass, but strongly recommended.
     *
     * These tests will compare actual screenshots. The fixtures have been designed
     * to (hopefully) not contain any UI elements that might render differently in
     * different browsers e.g. fonts. They have been checked to generate the same
     * results in Chrome, Chromium and Firefox.
     */
    takeScreenshot: webdriverTakeScreenshotContractTests,
  };
