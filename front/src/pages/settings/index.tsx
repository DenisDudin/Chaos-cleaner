// AICODE-NOTE: Экран настроек (API-ключ LLM, уведомления)
import { useState } from 'react';
import { Input, Button, Card } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import styles from './Settings.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Настройки</h1>
        <p className={styles.subtitle}>
          Управление API-ключами и параметрами приложения
        </p>
      </div>

      <div className={styles.stack}>
        <Card>
          <h2 className={styles.sectionTitle}>LLM API</h2>
          <div className={styles.stack}>
            <Input
              label="API-ключ"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите ваш API-ключ"
              helperText="Ключ хранится локально и используется для запросов к LLM"
            />
            <Button variant="default" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className={styles.sectionTitle}>Уведомления</h2>
          <div className={styles.row}>
            <div>
              <p className={styles.sectionTitle}>Уведомления о завершении анализа</p>
              <p className={styles.sectionSubtitle}>
                Получать уведомления, когда анализ завершён
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(styles.toggle, notifications && styles.toggleActive)}
            >
              <span
                className={cn(styles.toggleKnob, notifications && styles.toggleKnobActive)}
              />
            </button>
          </div>
        </Card>

        <Card>
          <h2 className={styles.sectionTitle}>О приложении</h2>
          <div className={styles.aboutText}>
            <p>Версия: 1.0.0</p>
            <p>ChaosCleaner — анализ и сводки из Telegram-каналов</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
