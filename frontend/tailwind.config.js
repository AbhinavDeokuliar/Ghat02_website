/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFDF5',
          100: '#FFF8DE',
          200: '#F5EDCD',
          300: '#E8DCBB',
          400: '#D4C5A9',
          500: '#B8A78B',
          600: '#8B7355',
          700: '#6B5847',
          800: '#5C4A3A',
          900: '#4A3829',
        },
      },
      keyframes: {
        'slide-in-top': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-top': 'slide-in-top 0.3s ease-out',
      },
    },
  },
  plugins: [],
}