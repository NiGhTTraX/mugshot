const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../tsconfig');

const rootDir = path.join(__dirname, '../');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir,
  testMatch: ['**/tests/**/*.spec.ts'],
  // For some reason Jest will complain that this is duplicating the packages/mugshot/package.json.
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/packages/' }),
    // For some reason the ts-jest helper doesn't pick this one up.
    '^mugshot/(.*)$': '<rootDir>/packages/mugshot/$1'
  },

  // Improves speed by 100%.
  extraGlobals: ['Math'],

  collectCoverageFrom: [
    '**/src/**/*',
    '!**/*.d.ts',
    '!**/tests/**/*',
    '!**/vendor/**/*'
  ],
  coverageDirectory: path.join(rootDir, 'tests/results'),
  coverageReporters: ['json', 'html'],

  globals: {
    'ts-jest': {
      tsConfig: {
        // Sourcemaps are kinda broken so we avoid transpiling,
        // plus it's not needed since tests run in latest node.
        target: 'es6'
      }
    }
  }
};
