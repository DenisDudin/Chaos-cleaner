// AICODE-NOTE: Layout компонент для Telegram Mini App с bottom navigation
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'presets' | 'history' | 'settings';
  onNavigate?: (page: 'home' | 'presets' | 'history' | 'settings') => void;
}

export const AppLayout = ({ children, currentPage = 'home', onNavigate }: AppLayoutProps) => {
  const navItems = [
    { id: 'home' as const, label: 'Анализ', icon: '📊' },
    { id: 'presets' as const, label: 'Пресеты', icon: '⭐' },
    { id: 'history' as const, label: 'История', icon: '📜' },
    { id: 'settings' as const, label: 'Настройки', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      {/* AICODE-NOTE: Основной контент с padding для bottom navigation */}
      <main className="flex-1 pb-20 px-4 pt-4 overflow-y-auto">
        {children}
      </main>

      {/* AICODE-NOTE: Bottom navigation для Telegram Mini App (мобильный first) */}
      {onNavigate && (
        <nav
          className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-sm"
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: '#333333',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col items-center justify-center
                    min-h-touch min-w-touch
                    transition-telegram
                    relative
                    ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                  `}
                  style={{
                    color: isActive ? '#2dd4bf' : '#737373',
                  }}
                  aria-label={item.label}
                >
                  {isActive && (
                    <span 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" 
                      style={{ backgroundColor: '#2dd4bf' }}
                    />
                  )}
                  <span className={`text-xl mb-1 transition-telegram ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

