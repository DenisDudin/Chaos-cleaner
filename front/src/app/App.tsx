// AICODE-NOTE: Главный компонент приложения с навигацией между страницами
import { useState } from 'react';
import { AppLayout } from '../shared/layout/AppLayout';
import { HomePage } from '../pages/home';
import { PresetsPage } from '../pages/presets';
import { HistoryPage } from '../pages/history';
import { SettingsPage } from '../pages/settings';

type Page = 'home' | 'presets' | 'history' | 'settings';

export const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'presets':
        return <PresetsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AppLayout>
  );
};


