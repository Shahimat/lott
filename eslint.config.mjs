// @ts-check
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ),
  eslintConfigPrettier,
  {
    ignores: [
      'node_modules',
      'dist',
      '.vscode',
      '.githooks',
      'docs',
      'eslint.config.mjs',
      'jest.config.js',
      'rollup.config.mjs',
    ],
  },
];
