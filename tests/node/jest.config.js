const baseConfig = require('../jest.config');
const path = require('path');

module.exports = {
  ...baseConfig,
  testMatch: ['**/tests/node/**/*.spec.ts'],
  coverageDirectory: path.join(baseConfig.rootDir, 'tests/node/results')
};
