export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
      },
    },
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
    },
  },
];
