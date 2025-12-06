// AICODE-NOTE: Экран истории запросов с результатами анализа
import { useState } from 'react';
import { Card, Badge, Button } from '@/shared/ui';
import styles from './History.module.css';

// AICODE-TODO: Заменить на реальные данные из API
interface HistoryItem {
  id: string;
  presetName?: string;
  channels: string[];
  timeRange: string;
  prompt: string;
  result: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    presetName: 'AI новости',
    channels: ['Канал 1', 'Канал 2'],
    timeRange: '7d',
    prompt: 'напиши новости, касающиеся AI',
    result: 'За последние 7 дней в выбранных каналах было опубликовано несколько важных новостей об искусственном интеллекте...',
    createdAt: '2024-01-15T10:30:00',
    status: 'completed',
  },
  {
    id: '2',
    channels: ['Канал 3'],
    timeRange: '3d',
    prompt: 'сводка по технологиям',
    result: '',
    createdAt: '2024-01-15T11:00:00',
    status: 'processing',
  },
];

const timeRangeLabels: Record<string, string> = {
  '1d': '24 часа',
  '3d': '3 дня',
  '7d': '7 дней',
  '14d': '14 дней',
  '30d': '30 дней',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const HistoryPage = () => {
  const [history] = useState<HistoryItem[]>(mockHistory);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>История запросов</h1>
        <p className={styles.subtitle}>
          Все выполненные анализы и их результаты
        </p>
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyText} style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p className={styles.emptyText}>История запросов пуста</p>
        </div>
      ) : (
        <div className={styles.list}>
          {history.map((item) => (
            <Card key={item.id}>
              <div className={styles.cardHeader}>
                <div className={styles.flexGrow}>
                  {item.presetName && (
                    <Badge variant="primary" className={styles.presetBadge}>
                      {item.presetName}
                    </Badge>
                  )}
                  <p className={styles.metaMuted}>
                    {formatDate(item.createdAt)}
                  </p>
                  <Badge
                    variant={
                      item.status === 'completed'
                        ? 'success'
                        : item.status === 'processing'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {item.status === 'completed'
                      ? 'Завершено'
                      : item.status === 'processing'
                      ? 'Обработка...'
                      : 'Ошибка'}
                  </Badge>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div>
                  <span className={styles.metaMuted}>Каналы: </span>
                  <div className={styles.chipRow}>
                    {item.channels.map((channel) => (
                      <Badge key={channel} variant="default">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className={styles.metaMuted}>Время: </span>
                  <Badge variant="default">{timeRangeLabels[item.timeRange]}</Badge>
                </div>

                <div>
                  <span className={styles.metaMuted}>Промт: </span>
                  <p className={styles.prompt}>{item.prompt}</p>
                </div>

                {item.status === 'completed' && item.result && (
                  <div className={styles.border} style={{ borderTopWidth: 1, marginTop: '1rem', paddingTop: '1rem' }}>
                    <span className={styles.subtitle}>
                      Результат:
                    </span>
                    <p className={styles.result}>
                      {item.result}
                    </p>
                  </div>
                )}
              </div>

              {item.status === 'completed' && (
                <div className={styles.actions}>
                  <Button variant="secondary" size="sm" className={styles.actionGrow}>
                    Копировать
                  </Button>
                  <Button variant="ghost" size="sm" className={styles.actionGrow}>
                    Повторить
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
