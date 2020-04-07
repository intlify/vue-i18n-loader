'use strict'

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/test/*.*'],
  testMatch: ['<rootDir>/test/**/*(*.)@(spec|test).[tj]s?(x)'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
}
