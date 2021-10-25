const path = require('path')

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    project: path.join(__dirname, 'tsconfig.json'),
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        ts: 'never',
      },
    ],
    'import/no-extraneous-dependencies': ['error'],
    'prettier/prettier': 'error',
    semi: 'off',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.ts'] },
      typescript: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  },
}

module.exports = config
