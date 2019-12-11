> Contract tests for Mugshot's various interfaces

----

## Usage

```typescript
import { browserContractTests } from '@mugshot/contracts';
import MyAdapter from './src';

describe('MyAdapter', () => {
  browserContractTests.forEach(test => {
    it(test.name, async () => {
      // Set up your framework/library here.
      const browser = setUpBrowserInstance();

      await test.runTest(browser, new MyAdapter(browser))
    });
  });
});
```
