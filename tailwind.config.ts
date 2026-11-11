import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand palette — deep indigo + electric violet + amber
        brand: {
          50:  '#f0f0ff',
          100: '#e2e1ff',
          200: '#cbc9fe',
          300: '#aaa6fd',
          400: '#8880fa',
          500: '#6c5ef7',  // primary
          600: '#5a40ef',
          700: '#4d31d8',
          800: '#4028b1',
          900: '#37258c',
          950: '#211660',
        },
        violet: {
          50:  '#f5f0ff',
          100: '#ede5ff',
          200: '#dcceff',
          300: '#c4a9ff',
          400: '#a87aff',
          500: '#8c47ff',
          600: '#7c24ff',
          700: '#6e13ef',
          800: '#5c0fc8',
          900: '#4c0fa0',
          950: '#2f0570',
        },
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        surface: {
          DEFAULT: '#0d0d1a',
          card:    '#12122a',
          border:  '#1e1e3a',
          hover:   '#1a1a35',
          muted:   '#2a2a50',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,94,247,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(108,94,247,0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'score-fill': {
          from: { strokeDashoffset: 'var(--circumference)' },
          to:   { strokeDashoffset: 'var(--target-offset)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        shimmer:          'shimmer 2s linear infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        float:            'float 3s ease-in-out infinite',
        'slide-up':       'slide-up 0.4s ease-out',
        'fade-in':        'fade-in 0.3s ease-out',
        'score-fill':     'score-fill 1.4s ease-out forwards',
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #6c5ef7 0%, #8c47ff 50%, #a87aff 100%)',
        'gradient-dark':    'linear-gradient(135deg, #0d0d1a 0%, #12122a 100%)',
        'gradient-card':    'linear-gradient(135deg, rgba(108,94,247,0.1) 0%, rgba(140,71,255,0.05) 100%)',
        'gradient-hero':    'radial-gradient(ellipse at 20% 50%, rgba(108,94,247,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(140,71,255,0.2) 0%, transparent 60%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(108,94,247,0.1) 50%, transparent 100%)',
      },
    },
  },
  plugins: [animate],
};

export default config;
