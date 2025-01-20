/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      brand: {
        green: '#357c4f',
        blue: '#0f0f54',
        brown: '#8f5c35',
        burgundy: '#882c29',
        paper: '#eee5d2',
        purple: '#6a4f98',
        red: '#da3a35',
        yellow: '#f5e14b',
      },
    },
    extend: { fontFamily: { sans: ['Inter var', 'sans-serif'] } },
  },
  plugins: [],
};
