export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./main.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e8',
          200: '#bce6d4',
          300: '#8dd3b7',
          400: '#56ba94',
          500: '#34a179',
          600: '#268362',
          700: '#1f6951',
          800: '#1c5442',
          900: '#194538',
        },
        secondary: {
          50: '#fef7f0',
          100: '#fdeee1',
          200: '#fad9c2',
          300: '#f6c098',
          400: '#f09f6c',
          500: '#eb8849',
          600: '#dc7030',
          700: '#b55826',
          800: '#914727',
          900: '#753c23',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
