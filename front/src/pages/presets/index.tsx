// AICODE-NOTE: Экран пресетов с карточками сохранённых наборов
import { useState } from 'react';
import { Card, Badge, Button } from '@/shared/ui';
import styles from './Presets.module.css';

// AICODE-TODO: Заменить на реальные данные из API
interface Preset {
  id: string;
  name: string;
  channels: string[];
  timeRange: string;
  prompt: string;
}

const mockPresets: Preset[] = [
  {
    id: '1',
    name: 'AI новости',
    channels: ['Канал 1', 'Канал 2'],
    timeRange: '7d',
    prompt: 'напиши новости, касающиеся AI',
  },
  {
    id: '2',
    name: 'Технологии',
    channels: ['Канал 2', 'Канал 3'],
    timeRange: '3d',
    prompt: 'сводка по технологическим новостям',
  },
];

const timeRangeLabels: Record<string, string> = {
  '1d': '24 часа',
  '3d': '3 дня',
  '7d': '7 дней',
  '14d': '14 дней',
  '30d': '30 дней',
};

export const PresetsPage = () => {
  const [presets] = useState<Preset[]>(mockPresets);

  const handleRunPreset = (preset: Preset) => {
    // AICODE-TODO: Запуск анализа с параметрами пресета
    console.log('Running preset:', preset);
  };

  const handleEditPreset = (preset: Preset) => {
    // AICODE-TODO: Редактирование пресета
    console.log('Editing preset:', preset);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.headerTitle}>Пресеты</h1>
          <p className={styles.headerSubtitle}>
            Сохранённые наборы каналов, промтов и настроек
          </p>
        </div>
        <Button variant="default" size="sm">
          + Создать
        </Button>
      </div>

      {presets.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Пресеты пока не созданы</p>
          <Button variant="default">Создать первый пресет</Button>
        </div>
      ) : (
        <div className={styles.list}>
          {presets.map((preset) => (
            <Card key={preset.id} interactive onClick={() => handleRunPreset(preset)}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{preset.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPreset(preset);
                  }}
                >
                  ✏️
                </Button>
              </div>

              <div className={styles.cardContent}>
                <div>
                  <span className={styles.label}>Каналы: </span>
                  <div className={styles.chips}>
                    {preset.channels.map((channel) => (
                      <Badge key={channel} variant="primary">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className={styles.label}>Время: </span>
                  <Badge variant="default">{timeRangeLabels[preset.timeRange]}</Badge>
                </div>

                <div>
                  <span className={styles.label}>Промт: </span>
                  <p className={styles.prompt}>
                    {preset.prompt}
                  </p>
                </div>
              </div>

              <Button
                variant="default"
                className={styles.cardFooter}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRunPreset(preset);
                }}
              >
                Запустить
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
