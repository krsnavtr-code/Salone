module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f6',
          100: '#ffe4eb',
          200: '#ffd8e9',
          300: '#ffbbd8',
          400: '#ff97c1',
          500: '#ff6b9a',
          600: '#ff4773',
          700: '#ff234b',
          800: '#ff0024',
          900: '#cc001c',
        },
        secondary: {
          50: '#f0f9f8',
          100: '#e0f3f2',
          200: '#c0eceb',
          300: '#a0e5e4',
          400: '#80dfe3',
          500: '#60d8e2',
          600: '#40cde1',
          700: '#20c2e0',
          800: '#00b6de',
          900: '#0099cc',
        },
      },
    },
  },
  plugins: [],
}
