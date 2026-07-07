/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#10161A', 50: '#1B2328', 100: '#212B31' },
        paper: { DEFAULT: '#E7E9E3', 100: '#F1F2ED', 200: '#DBDECF' },
        signal: { amber: '#DE9A3C', red: '#C64A3F', teal: '#2F8F82' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', '"Noto Sans Devanagari"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
