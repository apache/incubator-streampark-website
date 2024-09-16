/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  // corePlugins: {
  //   preflight: false,
  //   container: false,
  // },
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#588af2',
          500: '#2872ff',
          600: '#0d6efd',
        },
      },
    },
  },
  plugins: [],
};
