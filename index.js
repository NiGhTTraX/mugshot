var Mugshot = require('./lib/mugshot.js');

Mugshot.adapters = {
  LooksSame: require('./lib/adapters/looks-same.js')
};

Mugshot.interfaces = {
  differ: require('./lib/interfaces/differ.js'),
  fs: require('./lib/interfaces/fs.js'),
  PNGProcessor: require('./lib/interfaces/png-processor.js')
};

module.exports = Mugshot;
