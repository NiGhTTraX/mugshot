> [Playwright](https://www.npmjs.com/package/playwright) adapter for Mugshot

[![Build Status](https://travis-ci.com/NiGhTTraX/mugshot.svg?branch=master)](https://travis-ci.com/NiGhTTraX/mugshot) [![codecov](https://codecov.io/gh/NiGhTTraX/mugshot/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/mugshot) ![npm type definitions](https://img.shields.io/npm/types/@mugshot/playwright.svg)

----

## Install

```
npm install @mugshot/playwright
```
or
```
yarn add @mugshot/playwright
```

## Usage

```typescript
import Mugshot, {
  FsStorage,
  WebdriverScreenshotter,
} from 'mugshot';
import PlaywrightAdapter from '@mugshot/playwright';
import playwright from 'playwright';

test('GitHub project page should look the same', async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const mugshot = new Mugshot(
    new WebdriverScreenshotter(
      new PlaywrightAdapter(page)
    ),
    new FsStorage('./screenshots')
  );
  
  await page.goto('https://github.com/NiGhTTraX/mugshot');
  
  const result = await mugshot.check('project page');
  
  expect(result.matches).toBeTruthy();
});
```


## Docs

[View the API docs](../../docs/classes/playwrightadapter.html)
