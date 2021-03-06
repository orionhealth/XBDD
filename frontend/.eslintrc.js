module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/react',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly', document: 'readonly' },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import', 'import', 'jsx-a11y', 'prettier', 'react-hooks'],
  rules: {
    'class-methods-use-this': 'off',
    'import/default': 'off',
    'import/named': 'off',
    'import/newline-after-import': 'warn',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/order': ['warn', { 'newlines-between': 'always', groups: ['builtin', 'external'] }],
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': ['error', { allow: ['_t', '_raw', '_id'] }],
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'warn',
    'react/sort-comp': [
      'error',
      { order: ['constructor', 'static-methods', 'lifecycle', '/^on.+$/', 'everything-else', '/^render.+$/', 'render'] },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    react: {
      version: 'detect',
    },
  },
};
