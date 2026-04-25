import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral:  { DEFAULT: '#FF6B5F', dark: '#E5554A', light: '#FF9A92', 50:'#FFF1F0', 100:'#FFE0DD', 300:'#FFA39D', 600:'#E5554A', 700:'#BF3F36' },
        mint:   { DEFAULT: '#3ED6A3', dark: '#1BAE7D', light: '#8AF0CC', 50:'#EDFCF5', 600:'#2EB882', 700:'#219966' },
        blue:   { DEFAULT: '#4257FF', dark: '#2638D9', light: '#8C98FF', 50:'#EEEEFF', 700:'#2835B7' },
        cream:  '#FFF7ED',
        ink:    '#161827',
        night:  '#0E1020',
        'card-night': '#181B2E',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        score:   ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xs': '6px', 'sm': '10px', 'md': '14px',
        'lg': '20px', 'xl': '28px', '2xl': '36px',
      },
      boxShadow: {
        'sm':         '0 4px 12px rgba(22,24,39,0.08)',
        'md':         '0 12px 32px -8px rgba(22,24,39,0.12)',
        'lg':         '0 24px 64px -16px rgba(22,24,39,0.18)',
        'glow-coral': '0 0 28px rgba(255,107,95,0.34)',
        'glow-mint':  '0 0 28px rgba(62,214,163,0.34)',
        'glow-blue':  '0 0 28px rgba(66,87,255,0.30)',
      },
      animation: {
        'shimmer':    'picksy-shimmer 1.5s ease-in-out infinite',
        'pulse-glow': 'picksy-pulse-glow 2.4s ease-in-out infinite',
        'badge-pop':  'picksy-badge-pop 400ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-up':   'picksy-slide-up 300ms cubic-bezier(0,0,0.58,1) forwards',
        'pulse-ai':   'picksy-pulse-ai 1.5s cubic-bezier(0.4,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
