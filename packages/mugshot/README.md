![logo](logo.png)

> Framework independent visual testing library

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
