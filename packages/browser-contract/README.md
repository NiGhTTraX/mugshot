> Contract tests for Mugshot's `Browser` interface

----

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

You can use [@mugshot/selenium](../selenium) to get a Selenium grid with Chrome and Firefox to run your tests.
