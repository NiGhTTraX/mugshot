const baseConfig = require('tdd-buffet/config/jest.config');
const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../tsconfig');

const rootDir = path.join(__dirname, '../');

module.exports = {
  ...baseConfig,

  rootDir,
  // For some reason Jest will complain that this is duplicating the packages/mugshot/package.json.
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/packages/' }),
    // For some reason the ts-jest helper doesn't pick this one up.
    '^mugshot/(.*)$': '<rootDir>/packages/mugshot/$1'
  }
};
