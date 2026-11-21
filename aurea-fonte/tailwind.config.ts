import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { 100: 'var(--gold-100)', 200: 'var(--gold-200)', 300: 'var(--gold-300)', 400: 'var(--gold-400)', 500: 'var(--gold-500)', 600: 'var(--gold-600)' },
        ink: { 900: 'var(--ink-900)', 800: 'var(--ink-800)', 700: 'var(--ink-700)' },
        fg: { DEFAULT: 'var(--text-primary)', soft: 'var(--text-secondary)', gold: 'var(--text-gold)' },
        success: 'var(--success)', danger: 'var(--danger)',
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', pill: 'var(--radius-pill)' },
      fontFamily: { serif: ['var(--font-serif)', 'Georgia', 'serif'], sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
