var Mugshot = require('./lib/mugshot.js');

Mugshot.adapters = {
  LooksSame: require('./lib/adapters/looks-same.js')
};

Mugshot.interfaces = {
  browser: require('./lib/interfaces/browser.js'),
  differ: require('./lib/interfaces/differ.js'),
  fs: require('./lib/interfaces/fs.js'),
  PNGProcessor: require('./lib/interfaces/png-processor.js')
};

module.exports = Mugshot;
