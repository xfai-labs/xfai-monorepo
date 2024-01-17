const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*.{ts,tsx,js,jsx,html,svg}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [],
  presets: [require('../../libs/ui-components/tailwind.config.js')],
};
