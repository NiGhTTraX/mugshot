---
id: usage
title: Usage
description: TODO
slug: /usage
sidebar_position: 3
---

If you have an existing testing suite then it will be straightforward to add Mugshot to it. If you're starting from scratch then you can choose your favorite tools, Mugshot doesn't impose anything on you like a test runner or a particular way to write the tests.

Mugshot expects you to setup the testing environment. For instance, if you're planning to take screenshots of a website then you need to

1. Open the browser.
1. Navigate to the website you want to test.
1. Interact with the UI (scroll, click a button, input some text in a form etc.).

Once everything is set you just call [`Mugshot.check`](api/classes/mugshot.mugshot-1.md#check) and Mugshot will take care of taking a new screenshot, comparing it to the baseline, producing diffs and returning a passing or a failing result.

The following example illustrates the basics. It uses [WebdriverIO](https://webdriver.io/) to control a browser and [Jest](https://jestjs.io/) to run the test:

```typescript
import  {
  Mugshot,
  FsStorage,
  WebdriverScreenshotter,
} from 'mugshot';
import { WebdriverIOAdapter } from '@mugshot/webdriverio';
import { remote } from 'webdriverio';

test('GitHub project page should look the same', async () => {
  // 1. Open the browser.
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  // 2. Navigate to the page you want to test.
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  // 3. Set up mugshot.
  const mugshot = new Mugshot(
    new WebdriverScreenshotter(
      new WebdriverIOAdapter(browser)
    ),
    new FsStorage('screenshots')
  );

  // 4. Take the screenshot.
  const result = await mugshot.check('project page');
  
  // 5. Check the result.
  expect(result.matches).toBeTruthy();
});
```


## Taking screenshots

Mugshot doesn't care where the screenshots are coming from, as long as they're in **PNG** format. By default it ships with a [webdriver screenshotter](api/classes/mugshot.webdriverscreenshotter.md), but you can pass in your own implementation. See the [Screenshotter](api/interfaces/mugshot.screenshotter.md) interface for more details.


### Taking a screenshot of a single element

A [selector](api/types/mugshot.mugshotselector.md) can be passed as the second argument to [`Mugshot.check`](api/classes/mugshot.mugshot-1.md#check) and will tell Mugshot to only screenshot the corresponding element. How the element is selected depends on the [Screenshotter](api/interfaces/mugshot.screenshotter.md) implementation. For example, using the [WebdriverScreenshotter](api/classes/mugshot.webdriverscreenshotter.md), the element will be cropped out of the viewport according to its bounding rectangle.


### Ignoring elements

You can ignore elements on the page by passing a [selector](api/types/mugshot.mugshotselector.md) through the [`ignore`](api/interfaces/mugshot.screenshotoptions.md#ignore) option. The elements identified by that selector will be painted with the [`ignoreColor`](api/interfaces/mugshot.screenshotoptions.md#ignorecolor) (defaults to `#000`) before taking any screenshots.


### Storing screenshots

Screenshots are taken in **PNG** format and how they're stored is controlled by the [`ScreenshotStorage`](api/interfaces/mugshot.screenshotstorage.md) interface. Mugshot ships with a [local file system implementation](api/classes/mugshot.fsstorage.md), but you could easily plug in e.g. a cloud storage implementation.

Regardless of how they're stored, Mugshot will produce up to 3 screenshots:

1. A baseline screenshot. Think of it as a snapshot - how you expect your page/element to look.
2. The current screenshot. Mugshot will always take a new screenshot each time it's called and compare it to the baseline. If they match, the new screenshot is discarded, otherwise it's saved to the storage.
3. A diff. If the baseline and current screenshot are different then a diff highlighting the differences will be created and saved to the storage.


## Diffing screenshots

You can customize how diffs are produced by passing in a [`PNGDiffer`](api/interfaces/mugshot.pngdiffer.md) instance when instantiating [`Mugshot`](api/classes/mugshot.mugshot-1.md). Mugshot ships with [`PixelDiffer`](api/classes/mugshot.pixeldiffer.md) that compares screenshots pixels by pixels and marks the differing ones with a color.


### Reducing flakiness

A frequent source of flakiness in visual tests is dynamic data e.g. the current time and date or live API data. You can ignore elements that contain such data by painting over them with a solid color square. See the [ignore option](#ignoring-elements) for more details.

Other common sources are animations and the blinking cursor in input fields. If you're using the [`WebdriverScreenshotter`](api/classes/mugshot.webdriverscreenshotter.md) you can turn them off by passing the [`disableAnimations` flag](api/interfaces/mugshot.webdriverscreenshotteroptions.md#disableanimations).
