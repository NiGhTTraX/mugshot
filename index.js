var Mugshot = require('./lib/mugshot.js');

Mugshot.adapters = {
  WebdriverIO: require('./lib/adapters/webdriverio.js'),
};

Mugshot.interfaces = {
  browser: require('./lib/interfaces/browser.js'),
  fs: require('./lib/interfaces/fs.js'),
  PNGProcessor: require('./lib/interfaces/png-processor.js')
};

module.exports = Mugshot;
