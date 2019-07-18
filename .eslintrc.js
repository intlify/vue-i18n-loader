'use strict'

module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  extends: [
    'plugin:vue-libs/recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'off', // HACK: due to override with @typescript-eslint/no-unused-vars
    '@typescript-eslint/no-unused-vars': [2, { 'vars': 'all', 'args': 'none' }]
  }
}
