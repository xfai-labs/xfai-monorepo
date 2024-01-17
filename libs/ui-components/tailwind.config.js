const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // important: true,
  future: {
    // hoverOnlyWhenSupported: true,
  },
  content: [
    join(__dirname, 'src/**/*.{ts,tsx,js,jsx,html,svg}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        cyan: '#33CBCB',
        'cyan-dark': '#049494',
        magenta: '#FF0098',
        'magenta-dark': '#B0006A',
        red: '#ED0131',

        // Themed
        bg: 'rgb(var(--background) / <alpha-value>)',
        'white-black': 'rgb(var(--white-black) / <alpha-value>)',
        'black-white': 'rgb(var(--black-white) / <alpha-value>)',
        'white-blue': 'rgb(var(--white-blue) / <alpha-value>)',
        90: 'rgb(var(--grey-90) / <alpha-value>)',
        80: 'rgb(var(--grey-80) / <alpha-value>)',
        70: 'rgb(var(--grey-70) / <alpha-value>)',
        60: 'rgb(var(--grey-60) / <alpha-value>)',
        50: 'rgb(var(--grey-50) / <alpha-value>)',
        40: 'rgb(var(--grey-40) / <alpha-value>)',
        30: 'rgb(var(--grey-30) / <alpha-value>)',
        20: 'rgb(var(--grey-20) / <alpha-value>)',
        10: 'rgb(var(--grey-10) / <alpha-value>)',
        5: 'rgb(var(--grey-5) / <alpha-value>)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops) 50% 50%)',
      },
      dropShadow: {
        '3xl': '0 13px 13px rgb(0 0 0 / 0.05)',
      },
      fontFamily: {
        sans: ['var(--font-family, Rubik)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xsm: ['0.813rem', '1rem'],
        md: ['1.063rem', '1rem'],
      },
      spacing: {
        0.75: '0.188rem',
        1.75: '0.438rem',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
      },
      animation: {
        'spinner-rotate': 'rotate 1s linear infinite',
        'spinner-circle-rotate': 'spinner-circle-rotate 1s infinite ease-in-out',
        'spinner-round': 'rotate 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        ticker: 'ticker 40s linear infinite',
        'opacity-show': 'opacity 0.4 ease-in-out',
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px',
        vxl: { raw: '(min-height: 1024px)' },
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '4rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.animation-delay-150': {
          animationDelay: '150ms',
        },
        '.animation-delay-300': {
          animationDelay: '300ms',
        },
        '.animation-delay-450': {
          animationDelay: '450ms',
        },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.maskx-5': {
          maskImage:
            'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)',
        },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.animation-running': {
          animationPlayState: 'running',
        },
        '.animation-paused': {
          animationPlayState: 'paused',
        },
      });
    }),
  ],
};
