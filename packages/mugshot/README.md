![logo](../../logo.png)

> Framework independent visual testing library

[![Build Status](https://travis-ci.com/NiGhTTraX/mugshot.svg?branch=master)](https://travis-ci.com/NiGhTTraX/mugshot) [![codecov](https://codecov.io/gh/NiGhTTraX/mugshot/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/mugshot)

## Usage

Since different Webdriver libraries have different API and semantics, you will most likely need a wrapper over it to pass it to Mugshot.

Here is an example of using the [WebdriverIO](https://webdriver.io/) adapter:

```typescript
import Mugshot from 'mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import path from 'path';

(async () => {
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  const mugshot = new Mugshot(
    WebdriverIOAdapter(browser),
    path.join(__dirname, 'screenshots')
  );
  
  await browser.url('https://github.com/NiGhTTraX/mugshot');
  
  const result = await mugshot.check('whole-page');
  
  console.log(result.matches);
})();
```


### `check(name, selector?)`

The first argument is the name of the baseline screenshot - Mugshot will look for a file named `${name}.png` located in `resultsPath` that was passed in the constructor. If this file is missing, and `createBaselines` is `false`, then Mugshot will throw an error. If the file is found it will be compared against the fresh screenshot taken from the browser. If any differences are found then a `${name}.new.png` and a `${name}.diff.png` will be created in `resultsPath` and Mugshot will return a result with `{ matches: false }`.

A selector can be passed as the second argument and will tell Mugshot to only screenshot the corresponding element.
