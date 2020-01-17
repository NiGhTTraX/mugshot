> Puppeteer adapter for Mugshot

[![Build Status](https://travis-ci.com/NiGhTTraX/mugshot.svg?branch=master)](https://travis-ci.com/NiGhTTraX/mugshot) [![codecov](https://codecov.io/gh/NiGhTTraX/mugshot/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/mugshot) ![npm type definitions](https://img.shields.io/npm/types/@mugshot/puppeteer.svg)

----

## Usage

```typescript
import Mugshot, {
  FsStorage,
  WebdriverScreenshotter,
} from 'mugshot';
import PuppeteerAdapter from '@mugshot/puppeteer';
import puppeteer from 'puppeteer';

it('GitHub project page should look the same', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const mugshot = new Mugshot(
    new WebdriverScreenshotter(
      new PuppeteerAdapter(page)
    ),
    new FsStorage('./screenshots')
  );
  
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  const result = await mugshot.check('project page');
  
  expect(result.matches).toBeTruthy();
});
```
