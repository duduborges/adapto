import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Adapto brand palette
        ink: {
          DEFAULT: '#2a2021',
          50: '#f5f3f3',
          100: '#e6e1e1',
          200: '#cdc3c3',
          300: '#a89898',
          400: '#7d6868',
          500: '#5b4a4a',
          600: '#473838',
          700: '#3a2e2e',
          800: '#332828',
          900: '#2a2021',
          950: '#1a1314',
        },
        cream: {
          DEFAULT: '#fefefe',
          50: '#fefefe',
          100: '#fafafa',
          200: '#f3f3f3',
          300: '#e8e8e8',
          400: '#d4d4d4',
        },
        ember: {
          DEFAULT: '#c35622',
          50: '#fdf5f0',
          100: '#fae5d8',
          200: '#f4c6ad',
          300: '#eda07a',
          400: '#e57b4d',
          500: '#dc5e2f',
          600: '#c35622',
          700: '#a14420',
          800: '#823920',
          900: '#6b321e',
          950: '#39170d',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 4s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.6' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
