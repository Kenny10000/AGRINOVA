/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agriGreen: {
          DEFAULT: '#16a34a',
          dark: '#15803d',
          light: '#22c55e',
        },
        agriBlue: {
          DEFAULT: '#0284c7',
          dark: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}