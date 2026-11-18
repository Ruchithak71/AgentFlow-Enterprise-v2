/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apricot: {
          DEFAULT: '#F4BAA3',
          light: '#F8CEBC',
          dark: '#E29F84',
        },
        cream: {
          DEFAULT: '#F4F0E2',
          light: '#FAF7EE',
          dark: '#E6E0CC',
        },
        steel: {
          DEFAULT: '#619DC6',
          light: '#7FB2D6',
          dark: '#4A83AA',
        },
        sky: {
          DEFAULT: '#A6C8E2',
          light: '#C2DBEE',
          dark: '#8AB3D4',
        },
        ink: {
          DEFAULT: '#1E293B',
          muted: '#475569',
          faint: '#94A3B8',
        }
      }
    },
  },
  plugins: [],
}
