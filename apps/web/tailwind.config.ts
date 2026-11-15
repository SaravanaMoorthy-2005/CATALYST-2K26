import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Solarpunk + Elderly Healthcare Warm Palette
        leaf: {
          DEFAULT: '#16a34a',
          light: '#4ade80',
          dark: '#15803d',
          wash: 'rgba(74, 222, 128, 0.12)',
        },
        golden: {
          DEFAULT: '#fbbf24',
          deep: '#f59e0b',
          light: '#fef08a',
          wash: 'rgba(251, 191, 36, 0.18)',
        },
        cream: {
          light: '#fdfbf7',
          warm: '#fef3c7',
        },
        mint: {
          white: '#f0fdf4',
          DEFAULT: '#dcfce7',
        },
        sky: {
          DEFAULT: '#0284c7',
          light: '#38bdf8',
          wash: 'rgba(56, 189, 248, 0.15)',
        },
        ochre: {
          DEFAULT: '#1c1917',
          warm: '#78350f',
          light: '#a16207',
          muted: '#57534e',
        },
        lavender: {
          DEFAULT: '#8b5cf6',
          light: '#b692ff',
          wash: 'rgba(182, 146, 255, 0.15)',
        },
        // Backwards compatibility mappings for existing cc-* utility classes
        cc: {
          ink: '#1c1917', // Deep warm ochre-charcoal (no cold black)
          ivory: '#fdfbf7', // Warm cream light ground
          lemon: '#fbbf24', // Golden sunlight
          powder: '#38bdf8', // Solarpunk sky clean energy
          mist: '#dcfce7', // Soft leaf wash
          ice: '#e0f2fe', // Soft sky wash
          mint: '#f0fdf4', // Mint white
          surface: '#f0fdf4', // Mint white card surface
          muted: '#78350f', // Warm ochre muted
          border: 'rgba(74, 222, 128, 0.20)', // Subtle organic leaf border
        },
      },
      fontFamily: {
        sans: [
          'Nunito',
          'ui-sans-serif',
          'system-ui',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'sans-serif',
        ],
        headline: [
          'Nunito',
          'ui-sans-serif',
          'system-ui',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'sans-serif',
        ],
        body: [
          'Nunito',
          'ui-sans-serif',
          'system-ui',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
        input: '16px',
        media: '32px',
        dialog: '24px',
      },
      boxShadow: {
        card: '0 12px 32px rgba(74, 222, 128, 0.18)',
        'card-hover': '0 20px 48px rgba(74, 222, 128, 0.26)',
        'sun-button': '0 8px 20px rgba(251, 191, 36, 0.35)',
        'sun-button-hover': '0 14px 28px rgba(251, 191, 36, 0.45)',
        elevated: '0 16px 48px rgba(74, 222, 128, 0.22)',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}

export default config
