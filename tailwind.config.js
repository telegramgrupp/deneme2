/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B00F5',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#6B00F5',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3C1A80',
        },
        secondary: {
          DEFAULT: '#FF007A',
          50: '#FFF1F8',
          100: '#FFE4F3',
          200: '#FFBDE4',
          300: '#FF8FD1',
          400: '#FF4DB7',
          500: '#FF007A',
          600: '#E6006E',
          700: '#CC0062',
          800: '#B30056',
          900: '#99004A',
        },
        accent: {
          DEFAULT: '#FF5E00',
          50: '#FFF5F0',
          100: '#FFEDE3',
          200: '#FFD4B8',
          300: '#FFB380',
          400: '#FF8533',
          500: '#FF5E00',
          600: '#E65400',
          700: '#CC4A00',
          800: '#B34000',
          900: '#993700',
        }
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }
    },
  },
  plugins: [],
};