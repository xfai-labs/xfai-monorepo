const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,app,components,config}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html,svg}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        pools: '2.2fr repeat(5, 1fr)',
      },
    },
  },
  plugins: [],
  presets: [require('../../libs/ui-components/tailwind.config.js')],
};
