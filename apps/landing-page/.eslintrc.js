/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['plugin:@nx/react-typescript', '../../.eslintrc.js', 'next', 'next/core-web-vitals'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@next/next/no-html-link-for-pages': ['error', 'apps/landing-page/pages'],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
  env: {
    jest: true,
  },
};
