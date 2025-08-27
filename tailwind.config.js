/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      backgroundImage: {
        parchment: "url('/src/assets/parchment.jpg')",
        'comic-dots': "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        comic: '4px 4px 0 0 rgba(41,37,36,1)',
      },
      colors: {
        brand: {
          ink: '#292524',
          accent: '#ff8c2a',
          paper: '#fcfbf7',
        },
      },
      fontFamily: {
        caveat: ["'Caveat'", 'cursive'],
      },
    },
  },
  plugins: [],
};
