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
          DEFAULT: '#1E1E2C', // Deep Slate / Navy Surface for Dark Mode
          light: '#28293D',
          lighter: '#32344A',
          soft: '#F4F5F7', // Light Mode Secondary Surface
        },
        lightbg: '#F8F9FA',
        darkbg: '#14141E',
        card: {
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
          '0%': { boxShadow: '0 0 10px rgba(255, 100, 26, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 100, 26, 0.7)' },
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
