## Usage


```typescript
import Mugshot from 'mugshot';
import WebdriverIOAdapter from '@mugshot/webdriverio';
import { remote } from 'webdriverio';

(async () => {
  const browser = await remote({
    hostname: 'localhost',
    capabilities: { browserName: 'chrome' }
  });
  
  new Mugshot(
    WebdriverIOAdapter(browser),
    './screenshots'
  );
})();
```
