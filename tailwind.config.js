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
          DEFAULT: '#FF5200', // Vibrant Swiggy / Zomato Fiery Orange-Red
          hover: '#E04400',
          light: '#FF732E',
          glow: 'rgba(255, 82, 0, 0.45)',
        },
        secondary: {
          DEFAULT: '#141418', // Rich Obsidian Surface
          light: '#1C1C22',
          lighter: '#282832',
        },
        darkbg: '#0A0A0C', // Ultra Dark Background
        card: '#121216',
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
        'glow-primary': '0 0 30px rgba(255, 82, 0, 0.4)',
        'glow-sm': '0 0 15px rgba(255, 82, 0, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glass': '0 10px 40px 0 rgba(0, 0, 0, 0.75)',
        'card-hover': '0 14px 35px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 82, 0, 0.25)',
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
          '0%': { boxShadow: '0 0 10px rgba(255, 82, 0, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 82, 0, 0.8)' },
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

