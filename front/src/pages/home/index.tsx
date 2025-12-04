// AICODE-NOTE: Главный экран с формой быстрого анализа
import { useState } from 'react';
import { Button, Input, Textarea, LoadingSpinner } from '../../shared/ui';

// AICODE-TODO: Добавить более продвинутый DatePicker компонент для лучшего UX
// Для MVP используем нативный HTML5 date input

export const HomePage = () => {
  const [channelsInput, setChannelsInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channelsError, setChannelsError] = useState('');
  const [dateError, setDateError] = useState('');

  // Валидация и парсинг каналов из строки
  const parseChannels = (input: string): string[] => {
    return input
      .split(',')
      .map(ch => ch.trim().replace(/^@/, '')) // Удаляем @ и пробелы
      .filter(ch => ch.length > 0); // Убираем пустые значения
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setChannelsError('');
    setDateError('');

    // Валидация каналов
    const channels = parseChannels(channelsInput);
    if (channels.length === 0) {
      setChannelsError('Введите хотя бы один канал');
      isValid = false;
    }

    // Валидация дат
    if (!startDate || !endDate) {
      setDateError('Выберите начальную и конечную дату');
      isValid = false;
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (start > end) {
        setDateError('Начальная дата должна быть раньше конечной');
        isValid = false;
      } else if (end > today) {
        setDateError('Конечная дата не может быть в будущем');
        isValid = false;
      } else {
        // Проверка на максимальный диапазон (30 дней для MVP)
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 30) {
          setDateError('Максимальный период - 30 дней');
          isValid = false;
        }
      }
    }

    if (!prompt.trim()) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const channels = parseChannels(channelsInput);
    setIsLoading(true);

    try {
      // AICODE-TODO: Добавить toast-уведомления для ошибок вместо console.error
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/parse-channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channels,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Результаты парсинга:', data);
      // AICODE-TODO: Переход на экран результата или истории вместо console.log
    } catch (error) {
      console.error('Ошибка при парсинге каналов:', error);
      // AICODE-TODO: Добавить отображение ошибки пользователю
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Быстрый анализ</h1>
        <p style={{ color: '#a3a3a3' }}>
          Выберите каналы, период и введите промт для анализа
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Каналы"
          value={channelsInput}
          onChange={(e) => setChannelsInput(e.target.value)}
          placeholder="@channel1, @channel2 или channel1, channel2"
          error={channelsError}
          helperText="Введите названия каналов через запятую (с @ или без)"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#a3a3a3' }}>
            Временной промежуток
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Начальная дата"
                max={endDate || undefined}
              />
              <p className="mt-1 text-xs" style={{ color: '#a3a3a3' }}>С</p>
            </div>
            <div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Конечная дата"
                min={startDate || undefined}
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="mt-1 text-xs" style={{ color: '#a3a3a3' }}>По</p>
            </div>
          </div>
          {dateError && (
            <p className="mt-1 text-sm" style={{ color: '#f87171' }}>{dateError}</p>
          )}
          <p className="mt-1 text-xs" style={{ color: '#a3a3a3' }}>
            Максимальный период - 30 дней
          </p>
        </div>

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
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Анализирую...
              </span>
            ) : (
              'Запустить анализ'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
