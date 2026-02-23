/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF8F0',
          100: '#FFEDD5',
          200: '#FFDBA8',
          300: '#FFC470',
          400: '#FFA63D',
          500: '#FF6B00',
          600: '#E55A00',
          700: '#CC4400',
          800: '#993300',
          900: '#662200',
        },
        temple: {
          50: '#FDF9ED',
          100: '#F9EDCC',
          200: '#F0D98A',
          300: '#E8C44A',
          400: '#D4A012',
          500: '#B8860B',
          600: '#9A6F09',
          700: '#7C5807',
          800: '#5E4205',
          900: '#3F2C03',
        },
        vermillion: {
          50: '#FEF2F0',
          100: '#FDE0DC',
          200: '#F9B5AB',
          300: '#F4877A',
          400: '#E85E4E',
          500: '#E23D28',
          600: '#C62D1B',
          700: '#A12214',
          800: '#7C1A0F',
          900: '#5C130B',
        },
        burgundy: {
          50: '#F9F1F1',
          100: '#F0DCDC',
          200: '#E0B5B5',
          300: '#C98080',
          400: '#A85050',
          500: '#8B3030',
          600: '#6B2020',
          700: '#5C1A1A',
          800: '#4A1515',
          900: '#3A1010',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFF3E5',
          300: '#FFEAD0',
          400: '#FFE0B5',
          500: '#FFD699',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mandala-pattern': "url('/mandala-bg.svg')",
        'gradient-saffron': 'linear-gradient(135deg, #FF6B00 0%, #D4A012 50%, #E23D28 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFF8F0 0%, #FFEDD5 50%, #FFF8F0 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #2D1A0A 50%, #1A1A1A 100%)',
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(212, 160, 18, 0.15)',
        'warm-lg': '0 10px 40px rgba(212, 160, 18, 0.20)',
        'saffron': '0 4px 20px rgba(255, 107, 0, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
