var Mugshot = require('./lib/mugshot.js');

Mugshot.adapters = {
  WebdriverIO: require('./lib/adapters/webdriverio.js'),
  LooksSame: require('./lib/adapters/looks-same.js')
};

module.exports = Mugshot;
