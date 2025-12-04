// AICODE-NOTE: Экран истории запросов с результатами анализа
import { useState } from 'react';
import { Card, Badge, Button } from '../../shared/ui';

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
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text mb-2">История запросов</h1>
        <p className="text-dark-textSecondary">
          Все выполненные анализы и их результаты
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-textMuted">История запросов пуста</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {item.presetName && (
                    <Badge variant="primary" className="mb-2">
                      {item.presetName}
                    </Badge>
                  )}
                  <p className="text-xs text-dark-textMuted mb-2">
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

              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-sm text-dark-textMuted">Каналы: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.channels.map((channel) => (
                      <Badge key={channel} variant="default">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-dark-textMuted">Время: </span>
                  <Badge variant="default">{timeRangeLabels[item.timeRange]}</Badge>
                </div>

                <div>
                  <span className="text-sm text-dark-textMuted">Промт: </span>
                  <p className="text-sm text-dark-textSecondary mt-1">{item.prompt}</p>
                </div>

                {item.status === 'completed' && item.result && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <span className="text-sm font-medium text-dark-textSecondary mb-2 block">
                      Результат:
                    </span>
                    <p className="text-sm text-dark-text leading-relaxed whitespace-pre-wrap">
                      {item.result}
                    </p>
                  </div>
                )}
              </div>

              {item.status === 'completed' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Копировать
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
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

