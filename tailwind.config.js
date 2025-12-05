/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#E6FAF6',
          100: '#CCF5ED',
          200: '#99EBDB',
          300: '#66E0C9',
          400: '#33D6B7',
          500: '#00C9A7',
          600: '#00A186',
          700: '#007964',
          800: '#005043',
          900: '#002821',
        },
        accent: {
          50: '#FFE9E3',
          100: '#FFD4C7',
          200: '#FFA98F',
          300: '#FF7D57',
          400: '#FF521F',
          500: '#FF6B35',
          600: '#CC4415',
          700: '#993310',
          800: '#66220A',
          900: '#331105',
        },
      },
    },
  },
  plugins: [],
}

