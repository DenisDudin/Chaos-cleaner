// AICODE-NOTE: Главный экран с формой быстрого анализа
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Textarea,
  LoadingSpinner,
  Item,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Select,
  DateRangePicker,
} from '@/shared/ui';
import styles from './Home.module.css';
import type { DateRange } from 'react-day-picker';

const rangeSchema = z
  .object({
    from: z.union([z.date(), z.undefined()]),
    to: z.union([z.date(), z.undefined()]),
  })
  .default({ from: undefined, to: undefined });

const formSchema = z.object({
  channels: z.string().trim().min(1, 'Введите хотя бы один канал'),
  prompt: z.string().trim().min(1, 'Введите промт'),
  rangePreset: z.enum(['1d', '3d', '7d', '30d', 'custom']),
  customRange: rangeSchema.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channels: '',
      prompt: '',
      rangePreset: '7d',
      customRange: { from: undefined, to: undefined },
    },
  });

  const rangePreset = form.watch('rangePreset');

  const parseChannels = (input: string): string[] => {
    return input
      .split(',')
      .map(ch => ch.trim().replace(/^@/, ''))
      .filter(ch => ch.length > 0);
  };

  const toISODate = (date: Date) => date.toISOString().split('T')[0];

  const presetToRange = (preset: FormValues['rangePreset']): DateRange => {
    const end = new Date();
    const start = new Date();
    switch (preset) {
      case '1d':
        start.setDate(end.getDate() - 1);
        break;
      case '3d':
        start.setDate(end.getDate() - 3);
        break;
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    return { from: start, to: end };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.handleSubmit(async (values) => {
      const channels = parseChannels(values.channels);
      if (channels.length === 0) {
        form.setError('channels', { message: 'Введите хотя бы один канал' });
        return;
      }

      let range: DateRange | undefined;
      if (values.rangePreset === 'custom') {
        const custom = values.customRange;
        if (!custom?.from || !custom?.to) {
          form.setError('customRange', { message: 'Выберите даты' });
          return;
        }
        range = custom;
      } else {
        range = presetToRange(values.rangePreset);
      }

      if (!range?.from || !range?.to) {
        form.setError('customRange', { message: 'Выберите даты' });
        return;
      }

      setIsLoading(true);

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE_URL}/api/parse-channels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channels,
            startDate: toISODate(range.from),
            endDate: toISODate(range.to),
            prompt: values.prompt,
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
    })();
  };

  return (
    <div className={styles.container}>
      <Item>

      </Item>
      <div className={styles.header}>
        <h1 className={styles.title}>Быстрый анализ</h1>
        <p className={styles.subtitle}>
          Выберите каналы, период и введите промт для анализа
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField
            control={form.control}
            name="channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Каналы</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@channel1, @channel2 или channel1, channel2"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Введите названия каналов через запятую (с @ или без)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={styles.formSection}>
            <FormField
              control={form.control}
              name="rangePreset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Временной промежуток</FormLabel>
                  <FormControl>
                    <Select
                      options={[
                        { value: '1d', label: 'Последний день' },
                        { value: '3d', label: 'Последние 3 дня' },
                        { value: '7d', label: 'Последняя неделя' },
                        { value: '30d', label: 'Последний месяц' },
                        { value: 'custom', label: 'Выбрать свой период' },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Выберите период"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {rangePreset === 'custom' && (
              <FormField
                control={form.control}
                name="customRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Свой период</FormLabel>
                    <FormControl>
                      <DateRangePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Промт для LLM</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Например: напиши новости, касающиеся AI"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Опишите, какую информацию вы хотите получить из выбранных каналов
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className={styles.buttonRow}>
            <Button
              type="submit"
              className={styles.fullWidth}
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.cta}>
                  <LoadingSpinner size="sm" />
                  Анализирую...
                </span>
              ) : (
                'Запустить анализ'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
