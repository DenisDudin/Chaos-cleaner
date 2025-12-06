// AICODE-NOTE: Устанавливаем базовую тему через класс на documentElement.
// Позже этот же механизм можно использовать для переключения тем.

const THEME_DARK = 'theme-dark';
const THEME_LIGHT = 'theme-light';

export type Theme = 'dark' | 'light';

export const ensureDefaultTheme = (theme: Theme = 'dark') => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const hasTheme =
    root.classList.contains(THEME_DARK) || root.classList.contains(THEME_LIGHT);

  if (!hasTheme) {
    root.classList.add(theme === 'dark' ? THEME_DARK : THEME_LIGHT);
  }
};

export const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove(theme === 'dark' ? THEME_LIGHT : THEME_DARK);
  root.classList.add(theme === 'dark' ? THEME_DARK : THEME_LIGHT);
};

