// AICODE-NOTE: Экран пресетов с карточками сохранённых наборов
import { useState } from 'react';
import { Card, Badge, Button } from '../../shared/ui';

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
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">Пресеты</h1>
          <p className="text-dark-textSecondary">
            Сохранённые наборы каналов, промтов и настроек
          </p>
        </div>
        <Button variant="primary" size="sm">
          + Создать
        </Button>
      </div>

      {presets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-textMuted mb-4">Пресеты пока не созданы</p>
          <Button variant="primary">Создать первый пресет</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {presets.map((preset) => (
            <Card key={preset.id} interactive onClick={() => handleRunPreset(preset)}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-dark-text">{preset.name}</h3>
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

              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-sm text-dark-textMuted">Каналы: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {preset.channels.map((channel) => (
                      <Badge key={channel} variant="primary">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-dark-textMuted">Время: </span>
                  <Badge variant="default">{timeRangeLabels[preset.timeRange]}</Badge>
                </div>

                <div>
                  <span className="text-sm text-dark-textMuted">Промт: </span>
                  <p className="text-sm text-dark-textSecondary mt-1 line-clamp-2">
                    {preset.prompt}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
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

