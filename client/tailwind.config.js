const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        'hero-home': "url('/images/hero.jpg')",
        'hero-mob': "url('/images/hero-mob.jpg')",
        'unlock': "url('/images/unlock-potential.png')",
      }),
      screens: {
        portrait: { raw: '(orientation: portrait)' },
        // => @media (orientation: portrait) { ... }
        landscape: { raw: '(orientation: landscape)' },
        // => @media (orientation: landscape) { ... }
      },
    },
    fontFamily: {
      sans: ['Roboto', ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
