/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This creates the class "font-cinzel"
        cinzel: ['"Cinzel"', 'serif'],
        // This creates the class "font-sans" (default)
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        ocean: { 900: '#020617', 800: '#0B101B' },
        teal: { glow: '#14b8a6', bright: '#2DD4BF', dark: '#0f766e' },
        sand: { DEFAULT: '#fbbf24', light: '#fcd34d' }
      }
    },
  },
  plugins: [],
}