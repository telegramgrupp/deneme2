/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        secondary: {
          DEFAULT: '#EC4899',
          50: '#FCE7F3',
          100: '#FBCFE8',
          200: '#F9A8D4',
          300: '#F472B6',
          400: '#EC4899',
          500: '#DB2777',
          600: '#BE185D',
          700: '#9D174D',
          800: '#831843',
          900: '#500724',
          950: '#3B0764',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(99, 102, 241, 0.3), 0 0 10px -2px rgba(99, 102, 241, 0.2)',
        'glow-pink': '0 0 20px -5px rgba(236, 72, 153, 0.3), 0 0 10px -2px rgba(236, 72, 153, 0.2)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.3), 0 0 10px -2px rgba(139, 92, 246, 0.2)',
      }
    },
  },
  plugins: [],
};