const baseConfig = require('@tdd-buffet/jest-config');

module.exports = {
  ...baseConfig,

  // For some reason Jest will complain that this is duplicating the packages/mugshot/package.json.
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // For some reason the ts-jest helper doesn't pick this one up.
    '^mugshot/(.*)$': '<rootDir>/packages/mugshot/$1',
  },
};
