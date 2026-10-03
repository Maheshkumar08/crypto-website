import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      // Fills the gap between 16 (4rem) and 20 (5rem) in the default scale,
      // used for section padding (py-18, mt-18).
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(17, 24, 39, 0.06), 0 1px 2px -1px rgba(17, 24, 39, 0.04)',
        card: '0 12px 32px -12px rgba(17, 24, 39, 0.14), 0 2px 8px -2px rgba(17, 24, 39, 0.06)',
        lift: '0 24px 48px -16px rgba(17, 24, 39, 0.18), 0 4px 12px -4px rgba(17, 24, 39, 0.08)',
        glow: '0 0 0 1px rgba(37, 99, 235, 0.06), 0 20px 60px -20px rgba(37, 99, 235, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#374151',
            '--tw-prose-headings': '#111827',
            '--tw-prose-links': '#2563eb',
            '--tw-prose-bold': '#111827',
            '--tw-prose-quotes': '#111827',
            '--tw-prose-quote-borders': '#bfdbfe',
            '--tw-prose-code': '#111827',
            '--tw-prose-pre-bg': '#0f172a',
            '--tw-prose-th-borders': '#e2e8f0',
            '--tw-prose-td-borders': '#e2e8f0',
            maxWidth: 'none',
            a: { textDecoration: 'none', fontWeight: '500' },
            'a:hover': { textDecoration: 'underline' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [typography],
}
