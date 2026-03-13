/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#7fb6eb',
          DEFAULT: '#5c88b2',
          dark: '#0f4375',
          darkest: '#06182b'
        }
      }
    },
  },
  plugins: [],
}
