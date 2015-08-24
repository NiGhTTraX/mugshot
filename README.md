# Mugshot

Is a library for visual regression testing.

The beautiful of `Mugshot` comes from the ability that is independent from any `browser`, `test-runner`, `diffing tool` etc.
Mugshot defines `interfaces` that can be `implemented` and if you don't like the existing adaptors, you can 
[write your own](link).

##### Browser Adaptors
* [WebdriverIO](http://webdriver.io/)  

##### Differ Adaptors
* [Looks-same](https://github.com/gemini-testing/looks-same)

##### File System Adaptors
* [Node fs](http://devdocs.io/node/fs)

##### Plugins
* [Chai-Mugshot](link)

## Install

```npm install mugshot```

To add it to the dev dependencies add ```--save-dev```.

## Prerequisites

To use `Mugshot` you will need a `selenium server`. You can use the
[selenium-standalone](http://www.seleniumhq.org/download/) jar, you can run it with `java -jar jarFile`. Or you can use
this `npm module`: [selenium-standalone](https://www.npmjs.com/package/selenium-standalone), that will install 
everything for you.

If you are testing only with `phantomjs` you can run directly in `webdriver mode`, like this: `phantomjs --webdriver=4444`,
this way you skip the selenium-server and it is `much faster`.

## Usage

1. Turn on the browser with any configuration you want
2. Instanciate the browser adaptor and pass it the browser instance
3. Instanciate Mugshot and pass it the browser adaptor instance and your options, if you have
4. Call the test method with the captureItem and expect the result to be true

The `browser` you choose is totally `independent` from `Mugshot`, it should `exists` only the `adaptor` for it.

Every `browser adaptor` will receive as param only the `browser instance` that was built for. If you pass an instance of
another browser, of course it will not work...

`Mugshot` is mandatory to receive a `browser adaptor instance` and there is an optional `options` obejct.

```js
var options = {
  [fs]: {FS} an instance of a file system adaptor,
  [differ]: {Differ} an instance of a differ adaptor,
  [rootDirectory]: {String} the directory where the screenshots and diffs will be saved, default 'visual-tests'
};
```

`Mugshot` exposes only one method, i.e `test`, that receives a `captureItem` object and a `callback`.

```js
var captureItem = {
  name: {String} a name for the screenshot to save it on disk
  [selector]: {String} A html/css selector
};
```

If `no selector` is provided, then the `whole page` will be tested. The `name` must **not** contain and **extension**, 
the only extension for the images will be `png`.

The `test method` callback will receive an `error` param
and a `result` param, that will be `true` if the `images` are `identical`, i.e the tested selector does not differ,
and `false` if there are `differences`.

## Other specs

* if there is no baseline, i.e `Mugshot` finds not an image with the given name on disk, then there will be no diff process, 
the baseline will be written on disk and the returned result will be true (aka `first run`)
* `Mughsot cleans up`, if there are old screenshots and diffs form previous tests failures and now the tests pass, then this
will be deleted

## Example

We will describe an example with `mocha` and for assertion `chai`.

```js
var expect = require('chai').expect;
var Mugshot = require('mugshot');
var WebdriverIOAdaptor = Mugshot.WebdriverIOAdaptor;
var webdriverio = require('webdriverio');

describe('Suite', function() {
  before(function(done) {
    var options = {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    };
    
    // 1. Preparing the browser instance
    webdriverioInstance = webdriverio.remote(options).init().url('http://url')
      .then(function() {
        // 2. Instanciate the adaptor
        var browser = new WebdriverIOAdaptor(webdriverioInstance);
        
        // 3. Instanciate Mugshot, without options in this case
        var mugshot = new Mugshot(browser);
        
        done();
      });
  });
  
  it('should something', function(done) {
    var captureItem = {
      name: 'myComponent',
      selector: '#myComponent'
    };
      
    // 4. Do the testing
    mugshot.test(captureItem, function(error, result) {
      expect(error).to.be.null;
      
      expect(result).to.be.true;
    });
  });
  
  after(function() {
    return webdriverio.end();
  });
});
```

For better usage check out the [Chai-Mugshot](link) plugin.
