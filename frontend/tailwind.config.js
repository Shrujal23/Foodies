/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // enables .dark class toggle
  theme: {
    extend: {
      // ============================================
      //        PREMIUM ORANGE-PINK COLOR SYSTEM
      // ============================================
      colors: {
        gray: {
          50:  '#fdfafb',
          100: '#faf7f5',
          200: '#f5f0ed',
          300: '#ede5e0',
          400: '#e0d6d0',
          500: '#c7b8b0',
          600: '#a69389',
          700: '#857066',
          800: '#5d4d44',
          900: '#3a2e27',
        },
        orange: {
          50:  '#fff4ed',
          100: '#ffe8d6',
          200: '#ffd1b3',
          300: '#ffb999',
          400: '#ff8c66',
          500: '#ff6b40',   // main orange
          600: '#ff4d1f',
          700: '#e63b12',
          800: '#cc330f',
          900: '#b32c0d',
        },
        pink: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',   // main pink
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        rose: {
          500: '#f43f5e',
          600: '#e11d48',
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
      },

      // ============================================
      //                 TYPOGRAPHY
      // ============================================
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ============================================
      //               SPACING & RADIUS
      // ============================================
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },

      // ============================================
      //               SHADOWS & GLOW
      // ============================================
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 60px rgba(255, 107, 64, 0.4)',
        'glow-pink': '0 0 60px rgba(236, 72, 153, 0.4)',
        'glow-lg': '0 0 80px rgba(251, 113, 133, 0.6)',
      },

      // ============================================
      //                ANIMATIONS
      // ============================================
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 113, 133, 0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(251, 113, 133, 0.7)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },

      // ============================================
      //                BACKDROPS
      // ============================================
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    
    // Optional: Add this plugin for even more magic
    // require('tailwindcss-animate'),
  ],
}