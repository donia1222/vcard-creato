import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        begonia: {
          400: '#fe6c75',
          500: '#e1545d',
          600: '#f06069',
        },
        gun: {
          50:  '#f4f7fb',
          100: '#dfeefb',
          150: '#c8d5e3',
          200: '#a8b8cc',
          300: '#8a9bb3',
          400: '#6b7d99',
          600: '#3f4960',
          700: '#424e65',
          800: '#2a3347',
          900: '#0f1d2c',
        },
        cerulean: {
          50:  '#e0f1fa',
          400: '#15a0da',
        },
      },
      borderRadius: {
        xl2: '20px',
        xl3: '24px',
        xl4: '32px',
        xl5: '40px',
        pill: '1000px',
      },
      boxShadow: {
        card:   '0 4px 24px rgba(15,29,44,0.07)',
        cardHover: '0 8px 32px rgba(15,29,44,0.12)',
        coral:  '0 4px 20px rgba(254,108,117,0.30)',
        coralHover: '0 6px 28px rgba(254,108,117,0.40)',
      },
    },
  },
  plugins: [],
}

export default config
