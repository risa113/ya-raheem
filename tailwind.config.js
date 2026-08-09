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
          DEFAULT: '#FF641A', // Signature Food Delivery iOS Orange
          hover: '#E5530D',
          light: '#FF8347',
          dark: '#D94300',
          glow: 'rgba(255, 100, 26, 0.35)',
        },
        foodOrange: {
          DEFAULT: '#FC6011',
          light: '#FF7A38',
          dark: '#E04A00',
          gradient: '#FF5500',
        },
        foodYellow: {
          DEFAULT: '#FFB800',
          light: '#FFCE38',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #FFFFFF)',
          light: 'var(--color-secondary-light, #F4F5F7)',
          lighter: 'var(--color-secondary-lighter, #EBECEF)',
          soft: 'var(--color-secondary-soft, #F4F5F7)',
        },
        lightbg: '#F8F9FA',
        darkbg: 'var(--color-darkbg, #F8F9FA)',
        card: {
          DEFAULT: 'var(--color-card, #FFFFFF)',
          light: '#FFFFFF',
          dark: '#1E1E2C',
        },
        success: '#10B981',
        danger: '#EF4444',
        amber: {
          DEFAULT: '#FFB800',
          light: '#FFD043',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'ios-sm': '0 4px 15px rgba(0, 0, 0, 0.05)',
        'ios-card': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'ios-lg': '0 14px 40px rgba(0, 0, 0, 0.12)',
        'ios-orange': '0 10px 25px rgba(255, 100, 26, 0.35)',
        'glow-primary': '0 0 30px rgba(255, 100, 26, 0.4)',
        'glow-sm': '0 0 15px rgba(255, 100, 26, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
      }
    },
  },
  plugins: [],
}
