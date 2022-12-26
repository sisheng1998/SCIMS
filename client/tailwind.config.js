// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'h-[100px]',
    'h-[150px]',
    'h-[200px]',
    'h-[250px]',
    'h-[300px]',
    'h-[350px]',
    'h-[400px]',
    'h-[450px]',
    'h-[500px]',
    'h-[550px]',
    'max-w-[12rem]',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gilroy', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }

      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }

      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }

      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }

      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
