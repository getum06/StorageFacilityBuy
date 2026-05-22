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
        navy: {
          50: '#f0f4f9',
          100: '#d9e4f0',
          200: '#b3c9e1',
          300: '#8daed2',
          400: '#6793c3',
          500: '#4178b4',
          600: '#2d5a8e',
          700: '#1e3a5f',
          800: '#162c47',
          900: '#0f1f33',
          950: '#080f1a',
        },
        sage: {
          50: '#e8f4ec',
          100: '#c5e3cf',
          200: '#9ecfad',
          300: '#77ba8a',
          400: '#57a96e',
          500: '#3d7d52',
          600: '#2f6140',
          700: '#22452e',
          800: '#14291c',
          900: '#070d09',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
