const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,config}/**/*!(*.stories|*.spec).{ts,tsx,js,jsx,html,svg}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      backgroundImage: {
        'faq-light': "url('/faq/faq_light.jpg')",
        'faq-dark': "url('/faq/faq_dark.jpg')",
      },
    },
  },
  plugins: [],
  presets: [require('../../libs/ui-components/tailwind.config.js')],
};
