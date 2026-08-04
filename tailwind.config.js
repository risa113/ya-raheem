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
        primary: {
          DEFAULT: '#FF6B00',
          hover: '#E05D00',
          light: '#FF8833',
          glow: 'rgba(255, 107, 0, 0.4)',
        },
        secondary: {
          DEFAULT: '#111111',
          light: '#1A1A1A',
          lighter: '#242424',
        },
        darkbg: '#0B0B0B',
        card: '#141414',
        success: '#22C55E',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(255, 107, 0, 0.35)',
        'glow-sm': '0 0 12px rgba(255, 107, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 107, 0, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 107, 0, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
