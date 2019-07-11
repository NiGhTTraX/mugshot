const baseConfig = require('../jest.config');
const path = require('path');

// TODO: increase timeouts with https://github.com/facebook/jest/pull/8456
module.exports = {
  ...baseConfig,
  testMatch: ['**/tests/gui/**/*.spec.ts'],
  coverageDirectory: path.join(baseConfig.rootDir, 'tests/gui/results')
};
