import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cc: {
          ink: '#11141A',
          ivory: '#F9F5F1',
          lemon: '#FFF25C',
          powder: '#B2D8DD',
          mist: '#EAF2ED',
          ice: '#EAF2FF',
          mint: '#EDF5E8',
          surface: '#FFFFFF',
          muted: '#526166',
          border: 'rgba(17,20,26,0.08)',
        },
        cg: {
          lightBg: '#FFFFFF',
          lightCard: '#F4F1EC',
          lightText: '#1A1A1A',
          lightPrimary: '#0B5D5E',
          lightAlert: '#B45309',
          darkBg: '#0F1A1A',
          darkCard: '#1B2B2B',
          darkText: '#F5F5F5',
          darkPrimary: '#5EC4C4',
          darkAlert: '#F5A524',
        },
      },
      fontFamily: {
        atkinson: [
          'Atkinson Hyperlegible',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'sans-serif',
        ],
        headline: [
          'Stack Sans Headline',
          'system-ui',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'sans-serif',
        ],
        body: [
          'Stack Sans Text',
          'system-ui',
          'Noto Sans Tamil',
          'Noto Sans Devanagari',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '22px',
        pill: '999px',
        dialog: '20px',
      },
      boxShadow: {
        card: '0 8px 28px rgba(17,20,26,0.05)',
        elevated: '0 16px 48px rgba(17,20,26,0.10)',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}

export default config
