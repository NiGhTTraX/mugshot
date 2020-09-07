> WebdriverIO adapter for Mugshot

[![Build Status](https://travis-ci.com/NiGhTTraX/mugshot.svg?branch=master)](https://travis-ci.com/NiGhTTraX/mugshot) [![codecov](https://codecov.io/gh/NiGhTTraX/mugshot/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/mugshot) ![npm type definitions](https://img.shields.io/npm/types/@mugshot/webdriverio.svg)

----

## Install

```
npm install @mugshot/webdriverio
```
or
```
yarn add @mugshot/webdriverio
```

## Usage

```typescript
import Mugshot, {
  FsStorage,
  WebdriverScreenshotter,
} from 'mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import { remote } from 'webdriverio';

test('GitHub project page should look the same', async () => {
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  const mugshot = new Mugshot(
    new WebdriverScreenshotter(
      new WebdriverIOAdapter(browser)
    ),
    new FsStorage('./screenshots')
  );
  
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  const result = await mugshot.check('project page');
  
  expect(result.matches).toBeTruthy();
});
```


## Docs

[[WebdriverIOAdapter | View the API docs]]
