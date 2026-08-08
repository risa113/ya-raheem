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
          DEFAULT: '#F59E0B', // 24K Gourmet Saffron Gold
          hover: '#D97706',
          light: '#FCD34D',
          glow: 'rgba(245, 158, 11, 0.45)',
        },
        gold: {
          DEFAULT: '#F59E0B', // 24K Gold
          hover: '#D97706',
          light: '#FDE68A',
          glow: 'rgba(245, 158, 11, 0.5)',
        },
        ruby: {
          DEFAULT: '#E11D48', // Gourmet Crimson Ruby
          hover: '#BE123C',
          light: '#FB7185',
        },
        secondary: {
          DEFAULT: '#0D111A', // Midnight Obsidian Surface
          light: '#141A26',
          lighter: '#1F2738',
        },
        darkbg: '#07090E', // Ultra Dark Obsidian Velvet Background
        card: '#0B0F17',
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
        'glow-primary': '0 0 35px rgba(245, 158, 11, 0.45)',
        'glow-gold': '0 0 35px rgba(245, 158, 11, 0.5)',
        'glow-sm': '0 0 18px rgba(245, 158, 11, 0.35)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glass': '0 10px 40px 0 rgba(0, 0, 0, 0.85)',
        'card-hover': '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.3)',
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
          '0%': { boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(245, 158, 11, 0.85)' },
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

