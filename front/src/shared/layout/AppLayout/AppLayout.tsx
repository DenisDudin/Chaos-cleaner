// AICODE-NOTE: Layout компонент для Telegram Mini App с bottom navigation без Tailwind
import type { ReactNode } from 'react';
import { Search, Star, Clock3, Settings } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'presets' | 'history' | 'settings';
  onNavigate?: (page: 'home' | 'presets' | 'history' | 'settings') => void;
}

export const AppLayout = ({ children, currentPage = 'home', onNavigate }: AppLayoutProps) => {
  const navItems = [
    { id: 'home' as const, label: 'Анализ', icon: Search },
    { id: 'presets' as const, label: 'Пресеты', icon: Star },
    { id: 'history' as const, label: 'История', icon: Clock3 },
    { id: 'settings' as const, label: 'Настройки', icon: Settings },
  ];

  return (
    <div className={styles.container}>
      {/* AICODE-NOTE: Основной контент с padding для bottom navigation */}
      <main className={styles.main}>
        {children}
      </main>

      {/* AICODE-NOTE: Bottom navigation для Telegram Mini App (мобильный first) */}
      {onNavigate && (
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(styles.navButton, isActive && styles.navButtonActive)}
                  aria-label={item.label}
                >
                  <item.icon
                    className={cn(styles.navIcon, isActive && styles.navIconActive)}
                    strokeWidth={2}
                  />
                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
