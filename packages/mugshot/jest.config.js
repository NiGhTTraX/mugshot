const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,

  coverageReporters: [['lcov', { projectRoot: '../../' }], 'text-summary'],
};
