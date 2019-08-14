![logo](logo.png)

> Framework independent visual testing library

[![Build Status](https://travis-ci.com/NiGhTTraX/mugshot.svg?branch=master)](https://travis-ci.com/NiGhTTraX/mugshot) [![codecov](https://codecov.io/gh/NiGhTTraX/mugshot/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/mugshot) ![npm type definitions](https://img.shields.io/npm/types/mugshot.svg)

----

## Features

- Framework independent so you can choose your favorite tools or plug it into your existing testing suite.
- Can screenshot the whole viewport or just an element.
- Produces actual and diff images if a test fails.
- Can work with any Webdriver implementation through an adapter.
- Fails if baselines are missing (can be toggled through options).


## Intro

Manually checking one component for unexpected visual changes is hard. Doing it across your entire UI is harder. Doing it in multiple browsers is even harder. Making sure that everyone on your team does it is the hardest.

Mugshot aims to automate that process. It offers a simple API that lets you compare an existing baseline screenshot with a fresh screenshot taken from a browser instance and make sure they're identical. If they're not you'll get a diff image highlighting the differences. You can then commit them as the new baseline if they're expected, or fix the code and rerun the tests.

Expected | Actual | Diff
---------|--------|-----
![expected](./expected.png) | ![actual](./actual.png) | ![diff](./diff.png)

If you have an existing testing suite then it will be straightforward to add Mugshot to it. If you're starting from scratch with browser testing then you can choose your favorite tools, Mugshot doesn't impose anything on you. You will have full control over how you spin up browsers and how you control them. 

You can think of Mugshot as providing an assertion - "expect this part of the UI to look the same as last time". A visual test would typically look like:

1. Open the browser.
2. Navigate to an URL.
3. Interact with the UI (scroll, click a button, input some text in a form etc.).
4. Run the Mugshot assertion.


## Usage

Since different Webdriver libraries have different API and semantics, you will most likely need a wrapper over it to pass it to Mugshot.

Here is an example of using the [WebdriverIO](https://webdriver.io/) adapter:

```typescript
import Mugshot, { FsStorage } from 'mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import { remote } from 'webdriverio';

(async () => {
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  const mugshot = new Mugshot(
    new WebdriverIOAdapter(browser),
    new FsStorage('./screenshots')
  );
  
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  const result = await mugshot.check('viewport');
  
  console.log(result.matches);
})();
```

### Config

- `createMissingBaselines`: If set to true `Mugshot.check` will pass if a baseline is not found and it will create the baseline from the screenshot it takes.
- `updateBaselines`: When set to true Mugshot will overwrite any existing baselines and will create missing ones (equivalent to setting `createMissingBaselines: true`).
- `pngDiffer`: Will be used to compare images and create diffs. By default it uses [PixelDiffer](./README.md#pixeldiffer).
- `pngProcessor`: Will be used to process the screenshots e.g. crop them, paint over them etc. By default it uses [jimp](https://github.com/oliver-moran/jimp).


### `check(name, selector?, options?)`

The first argument is the name of the baseline screenshot - Mugshot will look for a file named `${name}.png` located in `resultsPath` that was passed in the constructor. If this file is missing, and `createMissingBaselines` is `false`, then Mugshot will throw an error. If the file is found it will be compared against the fresh screenshot taken from the browser. If any differences are found then a `${name}.actual.png` and a `${name}.diff.png` will be created in `resultsPath` and Mugshot will return a result with `{ matches: false }`.


#### Taking a screenshot of a single element

A selector can be passed as the second argument and will tell Mugshot to only screenshot the corresponding element. The element needs to be fully visible in the viewport.


#### Ignoring elements

You can ignore a single element on the page (for now, ignoring multiple elements is a planned feature) by passing a selector through the `ignore` option. The first element identified by that selector will be painted black before taking any screenshots.


## PixelDiffer

Default differ implementation that compares images pixel by pixel.

### Config

- `threshold`: A number between 0 and 1 representing the max difference in % between 2 pixels to be considered identical. 0 means the pixel need to be identical, 1 means two completely different images will be identical. 0.1 means black (#000) and 90% gray (0a0a0a) will be identical. Defaults to 0.
- `diffColor`: The color used to mark different pixels. Defaults to red.


## Reducing flakiness

A frequent source of flakiness in visual tests is dynamic data e.g. the current date or live API data. You can ignore elements that contain such data by by painting over them with a solid color square. See the [ignore option](./packages/mugshot/README.md#ignoring-elements) for more details.

Other common sources are animations and the blinking cursor in input fields. There is a planned feature where Mugshot will inject a stylesheet into your page to try to turn them off, but until then you can do it manually by including something along the following lines:

```css
input {
  caret-color: transparent;
}

*, *::before, *::after {
  transition: none !important;
  animation: none !important;
}
```


## Framework adapters

Package | Version
--------|--------
[@mugshot/webdriverio](./packages/webdriverio) | ![npm](https://img.shields.io/npm/v/@mugshot/webdriverio.svg)

If none of the provided adapters suit you, you can just roll your own by implementing the [`Browser` interface](./packages/mugshot/src/interfaces/browser.ts). To validate your implementation you can use the [contract tests package](./packages/browser-contract).
