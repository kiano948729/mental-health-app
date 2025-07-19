/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          background: '#DFF2E1',
          accent: '#FFF6B0',
          leaf: '#9DC183',
          text: '#3E3E3E',
          neutral: '#FFFFFF',
        },
        borderRadius: {
          'xl': '2rem',
          'full': '9999px',
        },
      },
    },
    plugins: [],
  }
  