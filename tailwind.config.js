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
          DEFAULT: '#FFD700', // Pure 24K Metallic Gold
          hover: '#E6B800',
          light: '#FFE44D',
          glow: 'rgba(255, 215, 0, 0.45)',
        },
        gold: {
          DEFAULT: '#FFD700', // 24K Pure Gold
          hover: '#D4AF37',
          light: '#FFF099',
          dark: '#B8860B',
          glow: 'rgba(255, 215, 0, 0.5)',
        },
        ruby: {
          DEFAULT: '#E11D48',
          hover: '#BE123C',
          light: '#FB7185',
        },
        secondary: {
          DEFAULT: '#0A0A0A', // Deep Charcoal Black Surface
          light: '#121212',
          lighter: '#1A1A1A',
        },
        darkbg: '#000000', // Pure Pitch Black Background
        card: '#080808',
        success: '#10B981',
        danger: '#EF4444',
        amber: {
          DEFAULT: '#FFD700',
          light: '#FFE44D',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 35px rgba(255, 215, 0, 0.45)',
        'glow-gold': '0 0 35px rgba(255, 215, 0, 0.55)',
        'glow-sm': '0 0 18px rgba(255, 215, 0, 0.35)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glass': '0 10px 40px 0 rgba(0, 0, 0, 0.95)',
        'card-hover': '0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(255, 215, 0, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 215, 0, 0.85)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}

