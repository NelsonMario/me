import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        'card-2': 'var(--card-2)',
        'card-3': 'var(--card-3)',
        ink: 'var(--ink)',
        pencil: 'var(--pencil)',
        graphite: 'var(--graphite)',
        red: 'var(--red)',
        yellow: 'var(--yellow)',
        mustard: 'var(--mustard)'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        chinese: ['"Noto Serif SC"', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        kalam: ['Kalam', 'cursive']
      }
    }
  },
  plugins: []
};
export default config;
