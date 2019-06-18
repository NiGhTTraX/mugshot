> Contract tests for Mugshot's `Browser` interface

----

## Requirements

Use [@mugshot/selenium](../selenium) to get a Selenium grid with Chrome and Firefox up and running. That package provides the test fixtures used by these tests.


## Usage

```typescript
import { describe, it, before } from 'mocha';
import MyAdapter from './src';
import browserContractTests, { BrowserToBeAdapted } from '@mugshot/browser-contract';

describe('MyAdapter', () => {
  let browser!: BrowserToBeAdapted;

  before(async () => {
    // Set up browser here.
  });

  browserContractTests.forEach(test => {
    it(test.name, test.getTest(browser, new MyAdapter(browser)));
  });
});
```
