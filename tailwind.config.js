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
          DEFAULT: 'var(--color-primary, #10B981)', // Royal Emerald Primary
          hover: 'var(--color-primary-hover, #059669)',
          light: 'var(--color-primary-light, #34D399)',
          glow: 'var(--color-primary-glow, rgba(16, 185, 129, 0.45))',
        },
        gold: {
          DEFAULT: 'var(--color-gold, #F59E0B)', // Royal Gold Accent
          hover: '#D97706',
          light: '#FBBF24',
          glow: 'rgba(245, 158, 11, 0.45)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #0E1715)', // Rich Emerald Obsidian
          light: 'var(--color-secondary-light, #152421)',
          lighter: 'var(--color-secondary-lighter, #1E332F)',
        },
        darkbg: 'var(--color-darkbg, #060C0B)', // Deep Midnight Background
        card: 'var(--color-card, #0B1412)',
        success: '#10B981',
        danger: '#EF4444',
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 30px var(--color-primary-glow, rgba(16, 185, 129, 0.4))',
        'glow-gold': '0 0 30px rgba(245, 158, 11, 0.4)',
        'glow-sm': '0 0 15px var(--color-primary-glow, rgba(16, 185, 129, 0.3))',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glass': '0 10px 40px 0 rgba(0, 0, 0, 0.75)',
        'card-hover': '0 14px 35px -5px rgba(0, 0, 0, 0.5), 0 0 20px var(--color-primary-glow, rgba(16, 185, 129, 0.25))',
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
          '0%': { boxShadow: '0 0 10px var(--color-primary-glow, rgba(16, 185, 129, 0.3))' },
          '100%': { boxShadow: '0 0 30px var(--color-primary-glow, rgba(16, 185, 129, 0.8))' },
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

