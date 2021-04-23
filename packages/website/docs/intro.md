---
sidebar_position: 1
---

# Getting started

Mugshot is a node library for doing visual regression testing. The way screenshots are taken, processed, compared and stored is entirely customizable. You can use it to write visual regression tests for websites, mobile apps, native apps etc. Moreover, Mugshot doesn't impose any preferences on how you write or execute the tests, it just gives you an assertion that you can call however and whenever you want.

## Installation

<!-- DUPLICATED in README.md. Please keep in sync. -->

```shell script
npm install --save-dev mugshot
```

Or alternatively with yarn

```shell script
yarn add -D mugshot
```

Depending on how you want to take screenshots, you'll need a [`Screenshotter`](./docs/interfaces/screenshotter.html) implementation. Mugshot bundles a [`WebdriverScreenshotter`](./docs/classes/webdriverscreenshotter.html) that you can use with Webdriver compatible clients e.g. [Selenium](https://selenium.dev/) or [Appium](http://appium.io/). Each client might need an adapter that translates its API to the interface that Mugshot expects. The following adapters are available:

Package | Version
--------|--------
[@mugshot/webdriverio](./docs/pages/adapters/webdriverio.html) | ![npm](https://img.shields.io/npm/v/@mugshot/webdriverio.svg)
[@mugshot/puppeteer](./docs/pages/adapters/puppeteer.html) | ![npm](https://img.shields.io/npm/v/@mugshot/puppeteer.svg)
[@mugshot/playwright](./docs/pages/adapters/playwright.html) | ![npm](https://img.shields.io/npm/v/@mugshot/playwright.svg)


If none of the provided adapters suit you, you can just roll your own by implementing the [`Webdriver` interface](./docs/interfaces/webdriver.html). See the [docs](./docs/pages/contracts/docs.html) on how to validate your implementation.

## Getting started

If you have an existing testing suite then it will be straightforward to add Mugshot to it. If you're starting from scratch then you can choose your favorite tools, Mugshot doesn't impose anything on you like a test runner or a particular way to write the tests.

Mugshot expects you to setup the testing environment. For instance, if you're planning to take screenshots of a website then you need to

1. Open the browser.
1. Navigate to the website you want to test.
1. Interact with the UI (scroll, click a button, input some text in a form etc.).

Once everything is set you just call [`Mugshot.check`](./docs/classes/mugshot.html#check) and Mugshot will take care of taking a new screenshot, comparing it to the baseline, producing diffs and returning a passing or a failing result.

The following example illustrates the basics. It uses [WebdriverIO](https://webdriver.io/) to control a browser and [Jest](https://jestjs.io/) to run the test:

```typescript
import Mugshot, {
  FsStorage,
  WebdriverScreenshotter,
} from 'mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import { remote } from 'webdriverio';

test('GitHub project page should look the same', async () => {
  // 1. Open the browser.
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  // 2. Navigate to the page you want to test.
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  // 3. Call mugshot.
  const mugshot = new Mugshot(
    new WebdriverScreenshotter(
      new WebdriverIOAdapter(browser)
    ),
    new FsStorage('./screenshots')
  );

  const result = await mugshot.check('project page');
  
  // 4. Check the result.
  expect(result.matches).toBeTruthy();
});
```


## Taking screenshots

Mugshot doesn't care where the screenshots are coming from, as long as they're in **PNG** format. By default it ships with a [webdriver screenshotter](./docs/classes/webdriverscreenshotter.html), but you can pass in your own implementation. See the [Screenshotter](./docs/interfaces/screenshotter.html) interface for more details.


### Taking a screenshot of a single element

A [selector](./docs/globals.html#mugshotselector) can be passed as the second argument to [`Mugshot.check`](./docs/classes/mugshot.html#check) and will tell Mugshot to only screenshot the corresponding element. How the element is selected depends on the [Screenshotter](./docs/interfaces/screenshotter.html) implementation. For example, using the [WebdriverScreenshotter](./docs/classes/webdriverscreenshotter.html), the element will be cropped out of the viewport according to its bounding rectangle.


### Ignoring elements

You can ignore elements on the page by passing a [selector](./docs/globals.html#mugshotselector) through the `ignore` option. The elements identified by that selector will be painted with the `ignoreColor` (defaults to `#000`) before taking any screenshots.


### Storing screenshots

Screenshots are taken in **PNG** format and how they're stored is controlled by the [`ScreenshotStorage`](./docs/interfaces/screenshotstorage.html) interface. Mugshot ships with a [local file system implementation](./docs/classes/fsstorage.html), but you could easily plug in e.g. a cloud storage implementation.

Regardless of how they're stored, Mugshot will produce up to 3 screenshots:

1. A baseline screenshot. Think of it as a snapshot - how you expect your page/element to look.
2. The current screenshot. Mugshot will always take a new screenshot each time it's called and compare it to the baseline. If they match, the new screenshot is discarded, otherwise it's saved to the storage.
3. A diff. If the baseline and current screenshot are different then a diff highlighting the differences will be created and saved to the storage.


## Diffing screenshots

You can customize how diffs are produced by passing in a [`PNGDiffer`](./docs/interfaces/pngdiffer.html) instance when instantiating [`Mugshot`](./docs/classes/mugshot.html). Mugshot ships with [`PixelDiffer`](./docs/classes/pixeldiffer.html) that compares screenshots pixels by pixels and marks the differing ones with a color.


### Reducing flakiness

A frequent source of flakiness in visual tests is dynamic data e.g. the current time and date or live API data. You can ignore elements that contain such data by painting over them with a solid color square. See the [ignore option](#ignoring-elements) for more details.

Other common sources are animations and the blinking cursor in input fields. If you're using the [`WebdriverScreenshotter`](./docs/classes/webdriverscreenshotter.html) you can turn them off by passing the [`disableAnimations` flag](./docs/interfaces/webdriverscreenshotteroptions.html#disableanimations).
