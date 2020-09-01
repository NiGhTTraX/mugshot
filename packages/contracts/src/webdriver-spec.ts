/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { readFileSync } from 'fs';
import Jimp from 'jimp';
import { Webdriver } from 'mugshot';
import { join } from 'path';

/**
 * Methods on the client that these tests need.
 *
 * They're different from the ones from [[WebdriverClient]] because
 * the tests are concerned with navigating the client to test
 * fixtures.
 */
export interface TestClient {
  /**
   * Navigate to an URL.
   */
  url: (path: string) => Promise<any>;
}

export interface WebdriverContractTest {
  name: string;

  /**
   * Run the test which will throw an `AssertionError` on failure.
   *
   * @param client The client you're adapting. It will be used to navigate to
   *   a test fixture and resize the window.
   * @param adapter The client adapter.
   */
  run: (client: TestClient, adapter: Webdriver) => Promise<void>;
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
  client: TestClient,
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

/**
 * Contract tests for the [[Webdriver]] interface.
 *
 * These exercise the [[Webdriver.takeScreenshot]] method, but they don't check
 * the actual screenshot content, only some basic properties. This is because
 * the tests can't assume any details about the environment in which they're
 * ran e.g. OS, actual client instance, user profile etc.
 */
export const webdriverContractTests: WebdriverContractTest[] = [
  {
    name: 'should take a viewport screenshot',
    run: async (client: TestClient, adapter: Webdriver) => {
      await loadFixture(client, adapter, Fixture.simple);

      const screenshot = await Jimp.read(
        Buffer.from(await adapter.takeScreenshot(), 'base64')
      );

      expect(screenshot.getWidth()).to.equal(1024);
      expect(screenshot.getHeight()).to.equal(768);
    },
  },
  {
    name:
      'should take a viewport screenshot with absolutely positioned elements',
    run: async (client: TestClient, adapter: Webdriver) => {
      await loadFixture(client, adapter, Fixture.rect);

      const screenshot = await Jimp.read(
        Buffer.from(await adapter.takeScreenshot(), 'base64')
      );

      expect(screenshot.getWidth()).to.equal(1024);
      expect(screenshot.getHeight()).to.equal(768);
    },
  },
  {
    name: 'should get bounding rect of element',
    run: async (client: TestClient, adapter: Webdriver) => {
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
    run: async (client: TestClient, adapter: Webdriver) => {
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
    run: async (client: TestClient, adapter: Webdriver) => {
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
