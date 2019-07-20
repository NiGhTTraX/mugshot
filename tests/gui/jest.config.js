const baseConfig = require('../jest.config');
const path = require('path');

module.exports = {
  ...baseConfig,
  testMatch: ['**/tests/gui/**/*.spec.ts'],
  coverageDirectory: path.join(baseConfig.rootDir, 'tests/gui/results')
};
