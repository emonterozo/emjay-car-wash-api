module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts'],
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
  ],
};
