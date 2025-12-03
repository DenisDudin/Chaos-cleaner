// AICODE-NOTE: Главный экран с формой быстрого анализа
import { useState } from 'react';
import { Button, MultiSelect, Select, Textarea } from '../../shared/ui';

// AICODE-TODO: Заменить моковые данные на реальные из API
const mockChannels = [
  { value: 'channel1', label: 'Канал 1' },
  { value: 'channel2', label: 'Канал 2' },
  { value: 'channel3', label: 'Канал 3' },
];

const timeRangeOptions = [
  { value: '1d', label: 'За последние 24 часа' },
  { value: '3d', label: 'За последние 3 дня' },
  { value: '7d', label: 'За последние 7 дней' },
  { value: '14d', label: 'За последние 14 дней' },
  { value: '30d', label: 'За последний месяц' },
];

export const HomePage = () => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedChannels.length === 0) {
      // AICODE-TODO: Добавить toast-уведомления для ошибок
      return;
    }

    if (!prompt.trim()) {
      return;
    }

    setIsLoading(true);
    // AICODE-TODO: Интеграция с API для запуска анализа
    setTimeout(() => {
      setIsLoading(false);
      // AICODE-TODO: Переход на экран результата или истории
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text mb-2">Быстрый анализ</h1>
        <p className="text-dark-textSecondary">
          Выберите каналы, период и введите промт для анализа
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <MultiSelect
          label="Каналы"
          options={mockChannels}
          selected={selectedChannels}
          onChange={setSelectedChannels}
          placeholder="Выберите каналы для анализа"
        />

        <Select
          label="Временной промежуток"
          options={timeRangeOptions}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        />

        <Textarea
          label="Промт для LLM"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Например: напиши новости, касающиеся AI"
          rows={6}
          helperText="Опишите, какую информацию вы хотите получить из выбранных каналов"
        />

        <div className="pt-4">
          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isLoading || selectedChannels.length === 0 || !prompt.trim()}
          >
            {isLoading ? 'Анализирую...' : 'Запустить анализ'}
          </Button>
        </div>
      </form>
    </div>
  );
};
