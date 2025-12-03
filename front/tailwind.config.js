// AICODE-NOTE: Конфигурация для Tailwind CSS 4.x
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AICODE-NOTE: Цветовая палитра в стиле дизайна с картинки
        // Primary: яркий бирюзовый/teal для акцентов и кнопок
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf', // Яркий бирюзовый для активных элементов
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e', // Основной primary для кнопок
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Background colors для тёмной темы
        dark: {
          bg: '#000000', // Чёрный фон
          surface: '#1a1a1a', // Тёмно-серый для карточек
          surfaceHover: '#262626', // Hover состояние
          border: '#333333', // Границы
          text: '#ffffff', // Основной текст
          textSecondary: '#a3a3a3', // Вторичный текст
          textMuted: '#737373', // Приглушённый текст
        },
      },
      spacing: {
        // AICODE-NOTE: Минимальные размеры для touch targets (≥44px)
        'touch': '44px',
        'touch-sm': '36px',
      },
      borderRadius: {
        'telegram': '12px', // Стандартный радиус для Telegram UI
      },
    },
  },
}


