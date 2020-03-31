const baseConfig = require('tdd-buffet/config/jest.config');

module.exports = {
  ...baseConfig,

  // For some reason Jest will complain that this is duplicating the packages/mugshot/package.json.
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // For some reason the ts-jest helper doesn't pick this one up.
    '^mugshot/(.*)$': '<rootDir>/packages/mugshot/$1',
  },

  // We're doing multiple coverage runs so we don't want to print the table every time
  // and we want to check thresholds once at the end with nyc.
  coverageReporters: ['json', 'html'],
  coverageThreshold: undefined,
};
