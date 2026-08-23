/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#FAF7F2',
          cream: '#F4EFE6',
          grey: '#EFECE6',
          red: '#8B0000',
          redHover: '#A61C1C',
          gold: '#C5A059',
          dark: '#1C1C1C'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
