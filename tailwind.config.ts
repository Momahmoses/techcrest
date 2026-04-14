import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#03080f',
          900: '#0a1628',
          800: '#112034',
          700: '#1a2f4a',
          600: '#243f62',
          500: '#2e507a',
        },
        accent: {
          50:  '#edfcff',
          100: '#d0f7ff',
          200: '#a6f0ff',
          300: '#5ee5ff',
          400: '#00d4f7',
          500: '#00b4d8',
          600: '#0090b8',
          700: '#007295',
          800: '#065c78',
          900: '#0a4d66',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body:    ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise':              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        'hero-mesh':          'radial-gradient(at 40% 20%, hsla(196,100%,42%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(220,100%,16%,0.5) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(196,100%,42%,0.1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(220,100%,10%,0.3) 0px, transparent 50%)',
        'card-shine':         'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
      },
      boxShadow: {
        'xs':          '0 1px 3px rgba(0,0,0,0.06)',
        'card':        '0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover':  '0 12px 48px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)',
        'card-lifted': '0 20px 60px rgba(0,0,0,0.18), 0 6px 20px rgba(0,0,0,0.1)',
        'glow':        '0 0 24px rgba(0,180,216,0.4), 0 0 8px rgba(0,180,216,0.2)',
        'glow-lg':     '0 0 48px rgba(0,180,216,0.35), 0 0 16px rgba(0,180,216,0.2)',
        'glow-gold':   '0 0 24px rgba(245,158,11,0.4), 0 0 8px rgba(245,158,11,0.2)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.1)',
        'dark':        '0 8px 32px rgba(0,0,0,0.35)',
        'dark-lg':     '0 20px 60px rgba(0,0,0,0.5)',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      animation: {
        'fade-up':      'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'slide-in':     'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up':     'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow':   'pulse 4s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,180,216,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(0,180,216,0.6), 0 0 80px rgba(0,180,216,0.2)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'spring':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in':'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      blur: {
        '4xl': '80px',
        '5xl': '120px',
      },
    },
  },
  plugins: [],
};

export default config;
