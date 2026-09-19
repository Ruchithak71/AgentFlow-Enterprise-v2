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
        sap: {
          blue: '#0a6ed1',
          dark: '#1e293b',
          gold: '#e09900',
        }
      }
    },
  },
  plugins: [],
}
