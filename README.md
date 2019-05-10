![logo](./logo.png)

> Visual testing library

## Usage

Mugshot wraps itself over a Webdriver instance and sends it commands to take screenshots of the given selectors. Since it doesn't manage the instance you are responsible for creating it and passing it in the constructor. Control of the instance is completely delegated to the user so things like navigating the browser to an URL, moving and clicking the mouse, filling in forms etc. are your responsibility. Once you set the browser instance in the desired test you can then call Mugshot to take a screenshot.

Mugshot can work with any number of Webdriver libraries via API adapters. Below is an example of using Mugshot with the popular library [WebdriverIO](https://webdriver.io/).

```typescript
import Mugshot, { WebdriverIOAdapter } from 'mugshot';
import { remote } from 'webdriverio';
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
