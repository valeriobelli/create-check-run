const path = require('path')

/** @type {import('@jest/types').Config} */
const config = {
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
  },
  roots: [path.join(__dirname, 'src')],
  testEnvironment: 'jest-environment-node',
  testLocationInResults: true,
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '.+/__tests__/.+.ts',
}

module.exports = config
