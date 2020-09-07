> Contract tests for Mugshot's various interfaces

----

## Install

```
npm install @mugshot/contracts
```
or
```
yarn add @mugshot/contracts
```

## Docs

### Implementing your own Webdriver adapter

Mugshot ships with a few adapters for the most popular webdriver clients, but if you need something else then you can easily write your own. You need to implement the [[Webdriver]] interface by providing a way to take screenshots, get element geometry and execute scripts on the page.

To validate your implementation you can run the [[webdriverContractSuites]]. Each suite consists of a number of tests that need your adapter implementation and a way to set up the test environment. See the example below for [[PuppeteerAdapter]] to understand how to run the tests:

```typescript
import { webdriverContractSuites } from '@mugshot/contracts';
import puppeteer from 'puppeteer';
import PuppeteerAdapter from './';

describe('PuppeteerAdapter', () => {
  let browser!: puppeteer.Browser, page!: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
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
})
```
