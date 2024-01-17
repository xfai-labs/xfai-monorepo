/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['plugin:@nx/react-typescript', 'plugin:@nx/react', '../../.eslintrc.js'],
  plugins: ['react-refresh'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        'react-refresh/only-export-components': 'warn',
        'react/destructuring-assignment': [
          'warn',
          'always',
          { ignoreClassFields: true, destructureInSignature: 'always' },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
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
