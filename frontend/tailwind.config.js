/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F8F4E1',
        text: '#74512D',
        accent: '#FEBA17',
        secondary: '#4E1F00',
        ui: {
          light: '#FDD287',
          DEFAULT: '#FBB03B',
          dark: '#F59E0B',
        }
      },
    },
  },
  plugins: [],
}