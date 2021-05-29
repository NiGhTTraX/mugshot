// eslint-disable-next-line import/no-extraneous-dependencies
const baseConfig = require('@tdd-buffet/jest-config');

module.exports = {
  ...baseConfig,

  testEnvironment: 'node',

  testTimeout: 10 * 1000,
};
