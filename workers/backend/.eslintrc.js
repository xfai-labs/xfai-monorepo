module.exports = {
  extends: ['plugin:@nx/typescript', '../../.eslintrc.js'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};
