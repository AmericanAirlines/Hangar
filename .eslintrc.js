module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts'] }],
    'max-len': [0],
    'import/prefer-default-export': ['off'],
    'object-curly-newline': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'no-await-in-loop': ['off'],
    'operator-linebreak': ['off'],
    'react/prop-types' : ['off'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['src/migration/**/*.ts'],
      rules: {
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
