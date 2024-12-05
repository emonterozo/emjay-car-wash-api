import js from "@eslint/js";
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,  // Recommended config applied to all files
  {
   
    languageOptions: {
      parser: tsParser,  // Set the parser for TypeScript files
    },
    plugins: {
      '@typescript-eslint': tsPlugin,  // Define the TypeScript plugin
    },
    rules: {
      '@typescript-eslint/no-shadow': ['error'],
      'no-shadow': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'error',
      'no-var': 'error',
      'semi': 'error',
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['dist/*'],
  },
  // File-pattern specific overrides
  {
    files: ['src/**/*', 'test/**/*'],
    rules: {
      'semi': ['warn', 'always'],
    },
  },
  
  {
    files: ['test/**/*'],
    rules: {
      'no-console': 'off',
    },
  },

  // Other configurations can go here
];
