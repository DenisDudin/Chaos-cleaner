// AICODE-NOTE: Экран настроек (API-ключ LLM, уведомления)
import { useState } from 'react';
import { Input, Button, Card } from '../../shared/ui';

export const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // AICODE-TODO: Загрузить настройки из API
  // AICODE-TODO: Сохранить настройки через API

  const handleSave = async () => {
    setIsSaving(true);
    // AICODE-TODO: Сохранение настроек
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text mb-2">Настройки</h1>
        <p className="text-dark-textSecondary">
          Управление API-ключами и параметрами приложения
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold text-dark-text mb-4">LLM API</h2>
          <div className="space-y-4">
            <Input
              label="API-ключ"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите ваш API-ключ"
              helperText="Ключ хранится локально и используется для запросов к LLM"
            />
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-dark-text mb-4">Уведомления</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text">Уведомления о завершении анализа</p>
              <p className="text-sm text-dark-textMuted">
                Получать уведомления, когда анализ завершён
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${notifications ? 'bg-primary-700' : 'bg-dark-border'}
                focus-ring
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${notifications ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-dark-text mb-4">О приложении</h2>
          <div className="space-y-2 text-sm text-dark-textSecondary">
            <p>Версия: 1.0.0</p>
            <p>ChaosCleaner — анализ и сводки из Telegram-каналов</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

