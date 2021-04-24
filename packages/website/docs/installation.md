---
id: installation
title: Installation
description: TODO
slug: /installation
sidebar_position: 2
---

```console
npm install --save-dev mugshot
```

Or alternatively with yarn

```console
yarn add -D mugshot
```

## Adapters

Depending on how you want to take screenshots, you'll need a [`Screenshotter`](api/interfaces/mugshot.screenshotter.md) implementation. Mugshot bundles a [`WebdriverScreenshotter`](api/classes/mugshot.webdriverscreenshotter.md) that you can use with Webdriver compatible clients e.g. [Selenium](https://selenium.dev/) or [Appium](http://appium.io/). Each client might need an adapter that translates its API to the interface that Mugshot expects. The following adapters are available:

Package | Version
--------|--------
[@mugshot/webdriverio](api/modules/_mugshot_webdriverio.md) | ![npm](https://img.shields.io/npm/v/@mugshot/webdriverio.svg)
[@mugshot/puppeteer](api/modules/_mugshot_puppeteer.md) | ![npm](https://img.shields.io/npm/v/@mugshot/puppeteer.svg)
[@mugshot/playwright](api/modules/_mugshot_playwright.md) | ![npm](https://img.shields.io/npm/v/@mugshot/playwright.svg)


If none of the provided adapters suit you, you can just roll your own by implementing the [`Webdriver` interface](api/interfaces/mugshot.webdriver.md). See the [docs](api/modules/_mugshot_contracts.md) on how to validate your implementation.


### Implementing your own Webdriver adapter

Mugshot ships with a few adapters for the most popular webdriver clients, but if you need something else then you can easily write your own. You need to implement the [`Webdriver` interface](api/interfaces/mugshot.webdriver.md) by providing a way to take screenshots, get element geometry and execute scripts on the page.

To validate your implementation you can run the [contract tests](api/variables/_mugshot_contracts.webdrivercontractsuites.md). Each suite consists of a number of tests that need your adapter implementation and a way to set up the test environment.

The example below illustrates how to run the tests with [Jest](https://jestjs.io/) for [PuppeteerAdapter](api/classes/_mugshot_puppeteer.puppeteeradapter.md):

```typescript
import { webdriverContractSuites } from '@mugshot/contracts';
import { PuppeteerAdapter } from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';

describe('PuppeteerAdapter', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  const setup = {
    url: (path: string) => page.goto(path),
  };

  Object.keys(webdriverContractSuites).forEach((suite) => {
    describe(suite, () => {
      webdriverContractSuites[suite].forEach((test) => {
        it(test.name, () => test.run(setup, new PuppeteerAdapter(page)));
      });
    });
  });
});
```
