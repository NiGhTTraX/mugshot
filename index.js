var Mugshot = require('./lib/mugshot.js');

Mugshot.adapters = {
  WebdriverIOAdaptor: require('./lib/adapters/webdriverio.js'),
  LooksSameAdaptor: require('./lib/adapters/looks-same.js')
};

module.exports = Mugshot;
