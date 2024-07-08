/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    screens: {
      lg: '1100px',
      sm: '600px',
    },
  },
  plugins: [],
}
