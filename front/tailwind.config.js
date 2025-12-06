/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AICODE-NOTE: Цветовая палитра в стиле дизайна с картинки
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
          DEFAULT: '#0f766e',
          foreground: '#ffffff',
        },
        dark: {
          bg: '#000000',
          surface: '#1a1a1a',
          surfaceHover: '#262626',
          border: '#333333',
          text: '#ffffff',
          textSecondary: '#a3a3a3',
          textMuted: '#737373',
        },
        background: 'var(--dark-bg)',
        foreground: 'var(--dark-text)',
        card: {
          DEFAULT: 'var(--dark-surface)',
          foreground: 'var(--dark-text)',
        },
        popover: {
          DEFAULT: 'var(--dark-surface)',
          foreground: 'var(--dark-text)',
        },
        muted: {
          DEFAULT: 'var(--dark-surface-hover)',
          foreground: 'var(--dark-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--dark-surface-hover)',
          foreground: 'var(--dark-text)',
        },
        border: 'var(--dark-border)',
        input: 'var(--dark-border)',
        ring: 'var(--primary-400)',
      },
      borderRadius: {
        telegram: '12px',
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      spacing: {
        touch: '44px',
        'touch-sm': '36px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

