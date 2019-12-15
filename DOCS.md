![logo](media/logo.png)

<div align="center">
<h2>Framework independent visual testing library</h2>

[![Build Status](https://travis-ci.com/NiGhTTraX/mugshot.svg?branch=master)](https://travis-ci.com/NiGhTTraX/mugshot) [![codecov](https://codecov.io/gh/NiGhTTraX/mugshot/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/mugshot) ![npm type definitions](https://img.shields.io/npm/types/mugshot.svg)
</div>

----

Mugshot is a node library for doing visual regression testing. The way screenshots are taken, processed, compared and stored is entirely customizable. Moreover, Mugshot doesn't impose any preferences on how you write or execute the tests, it just gives you an assertion that you can call however and whenever you want.

----

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of content**

- [Installation](#installation)
- [Basic example](#basic-example)
- [Taking screenshots](#taking-screenshots)
  - [Taking a screenshot of a single element](#taking-a-screenshot-of-a-single-element)
  - [Ignoring elements](#ignoring-elements)
  - [Storing screenshots](#storing-screenshots)
  - [Reducing flakiness](#reducing-flakiness)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

```shell script
npm install --save-dev mugshot
```

Or alternatively with yarn

```shell script
yarn add -D mugshot
```

Depending on how you want to take screenshots, you'll need a [`Screenshotter`](./docs/interfaces/screenshotter.html) implementation. Mugshot bundles a [`BrowserScreenshotter`](./docs/classes/browserscreenshotter.html) that you can use with Webdriver compatible browsers. Each browser might need an adapter that translates its API to the interface that Mugshot expects. The following adapters are available:

Package | Version
--------|--------
[@mugshot/webdriverio](./packages/webdriverio) | ![npm](https://img.shields.io/npm/v/@mugshot/webdriverio.svg)
[@mugshot/puppeteer](./packages/puppeteer) | ![npm](https://img.shields.io/npm/v/@mugshot/puppeteer.svg)

If none of the provided adapters suit you, you can just roll your own by implementing the [`Browser` interface](./docs/interfaces/browser.html). To validate your implementation you can use the [contract tests package](./packages/contracts).


## Basic example

If you have an existing testing suite then it will be straightforward to add Mugshot to it. If you're starting from scratch then you can choose your favorite tools, Mugshot doesn't impose anything on you like a test runner or a particular way to write the tests.

You can think of Mugshot as providing an assertion - "expect this part of the UI to look the same as last time". A visual test would typically look like:

1. Open the app.
2. Navigate to the screen you wish to check.
3. Interact with the UI (scroll, click a button, input some text in a form etc.).
4. Run the Mugshot assertion.

The first 3 steps are fully in your control - you are responsible for setting the test up. Once everything is set you just call [`Mugshot.check`](./docs/classes/mugshot.html#check) and Mugshot will take care of taking a new screenshot, comparing it to the baseline, producing diffs and returning a passing or a failing result.

Here is an example of a test that makes sure a website doesn't have any visual changes using [WebdriverIO](https://webdriver.io/):

```typescript
import Mugshot, {
  FsStorage,
  BrowserScreenshotter,
} from 'mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import { remote } from 'webdriverio';

it('GitHub project page should look the same', async () => {
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  const mugshot = new Mugshot(
    new BrowserScreenshotter(
      new WebdriverIOAdapter(browser)
    ),
    new FsStorage('./screenshots')
  );
  
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  const result = await mugshot.check('project page');
  
  expect(result.matches).toBeTruthy();
});
```


## Taking screenshots

Mugshot doesn't care where the screenshots are coming from, as long as they're in **PNG** format. By default it ships with a browser screenshotter, but you can plug your own implementation that either does things differently, or interacts with something other than a browser e.g. a mobile device. See the [Screenshotter](./docs/interfaces/screenshotter.html) interface for more details.


### Taking a screenshot of a single element

A selector can be passed as the second argument to [`Mugshot.check`](./docs/classes/mugshot.html#check) and will tell Mugshot to only screenshot the corresponding element. How the element is selected depends on the [Screenshotter](./docs/interfaces/screenshotter.html) implementation. For example, using the [BrowserScreenshotter](./docs/classes/browserscreenshotter.html), the element will be cropped out of the viewport according to its bounding rectangle.


### Ignoring elements

You can ignore elements on the page by passing a selector through the `ignore` option. The elements identified by that selector will be painted black before taking any screenshots.


### Storing screenshots

Screenshots are taken in **PNG** format and how they're stored is controlled by the [`ScreenshotStorage`](./docs/interfaces/screenshotstorage.html) interface. Mugshot ships with a [local file system implementation](./docs/classes/fsstorage.html), but you could easily plug in e.g. a cloud storage implementation.


### Reducing flakiness

A frequent source of flakiness in visual tests is dynamic data e.g. the current time and date or live API data. You can ignore elements that contain such data by painting over them with a solid color square. See the [ignore option](#ignoring-elements) for more details.

Other common sources are animations and the blinking cursor in input fields. If you're using the [`BrowserScreenshotter`](./docs/classes/browserscreenshotter.html) you can turn them off by passing the [`disableAnimations` flag](./docs/interfaces/browserscreenshotteroptions.html#disableanimations).
