'use strict'

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/test/*.*'],
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
