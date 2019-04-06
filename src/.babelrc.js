const config = require('../.babelrc');

if (process.env.COVERAGE) {
  config.plugins.push('istanbul');
}

module.exports = config;
