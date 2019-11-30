> Contract tests for Mugshot's various interfaces

----

## Usage

```typescript
import { describe, it, before } from 'mocha';
import MyAdapter from './src';
import { browserContractTests, TestBrowser } from '@mugshot/contracts';

describe('MyAdapter', () => {
  let browser!: TestBrowser;

  before(async () => {
    // Set up browser here.
  });

  browserContractTests.forEach(test => {
    it(test.name, test.getTest(browser, new MyAdapter(browser)));
  });
});
```
