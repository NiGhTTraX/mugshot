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

## Usage

```typescript
import { webdriverContractTests } from '@mugshot/contracts';
import MyAdapter from './src';

describe('MyAdapter', () => {
  webdriverContractTests.forEach(test => {
    it(test.name, async () => {
      // Set up your framework/library here.
      const browser = setUpBrowserInstance();

      await test.runTest(browser, new MyAdapter(browser))
    });
  });
});
```
