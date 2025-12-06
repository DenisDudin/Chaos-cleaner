// AICODE-NOTE: Главный экран с формой быстрого анализа
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Badge,
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
type ChannelSuggestion = {
  handle: string;
  title?: string;
  photoUrl?: string;
  type?: string;
};

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
  const [channelSuggestions, setChannelSuggestions] = useState<ChannelSuggestion[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [lastFetchedQuery, setLastFetchedQuery] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channels: '',
      prompt: '',
      rangePreset: '7d',
      customRange: { from: undefined, to: undefined },
    },
  });

  const parseChannels = (input: string): string[] => {
    return input
      .split(',')
      .map(ch => ch.trim().replace(/^@/, ''))
      .filter(ch => ch.length > 0);
  };

  const channelsValue = form.watch('channels');
  const searchQuery = useMemo(() => channelsValue.trim(), [channelsValue]);

  const rangePreset = form.watch('rangePreset');

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

  useEffect(() => {
    if (!searchQuery) {
      setChannelSuggestions([]);
      setLastFetchedQuery('');
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSuggestLoading(true);
      try {
        // AICODE-NOTE: Автокомплит обращается к /api/channels/search?query=...; обнови путь, если бэкенд изменится.
        const response = await fetch(
          `${API_BASE_URL}/api/channels/search?query=${encodeURIComponent(searchQuery)}&limit=5`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : data.channels ?? [];
        const normalized = list
          .map((item: unknown): ChannelSuggestion | null => {
            if (typeof item === 'string') {
              const handle = item.replace(/^@/, '');
              return handle ? { handle, title: `@${handle}` } : null;
            }
            if (typeof item === 'object' && item) {
              const obj = item as Record<string, unknown>;
              const handleRaw = obj.handle ?? obj.name ?? obj.username;
              if (typeof handleRaw === 'string') {
                const handle = handleRaw.replace(/^@/, '');
                if (!handle) return null;
                const title = typeof obj.title === 'string' && obj.title.length > 0 ? obj.title : `@${handle}`;
                const photoUrl = typeof obj.photoUrl === 'string' ? obj.photoUrl : undefined;
                const type = typeof obj.type === 'string' ? obj.type : undefined;
                return { handle, title, photoUrl, type };
              }
            }
            return null;
          })
          .filter((item: ChannelSuggestion | null): item is ChannelSuggestion => Boolean(item))
          .filter((item: ChannelSuggestion) => !selectedChannels.includes(item.handle))
          .slice(0, 5);

        setChannelSuggestions(normalized);
        setLastFetchedQuery(searchQuery);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Не удалось получить список каналов', error);
          setChannelSuggestions([]);
          setLastFetchedQuery(searchQuery);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSuggestLoading(false);
        }
      }
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery, selectedChannels]);

  const handleSelectChannel = (channel: string) => {
    const normalized = channel.replace(/^@/, '');
    setSelectedChannels(prev => {
      const next = Array.from(new Set([...prev, normalized]));
      return next;
    });
    form.setValue('channels', '');
    form.clearErrors('channels');
    setChannelSuggestions([]);
    setLastFetchedQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.handleSubmit(async (values) => {
      const channels = Array.from(
        new Set([...selectedChannels, ...parseChannels(values.channels)])
      );
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
              <div className={styles.labelRow}>
                <FormLabel>Каналы:</FormLabel>
                {selectedChannels.length > 0 && (
                  <div className={styles.badgeRow}>
                    {selectedChannels.map(channel => (
                      <Badge key={channel} variant="primary" className={styles.channelBadge}>
                        @{channel}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.suggestionsWrapper}>
                <FormControl>
                  <Input
                    placeholder="@channel1, @channel2 или channel1, channel2"
                    autoComplete="off"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                    }}
                  />
                </FormControl>
                {searchQuery && (
                  <div className={styles.suggestions}>
                    {isSuggestLoading && (
                      <div className={styles.suggestionStatus}>
                        <LoadingSpinner size="sm" />
                        <span>Ищем каналы...</span>
                      </div>
                    )}
                    {channelSuggestions.map(channel => (
                      <button
                        key={channel.handle}
                        type="button"
                        className={styles.suggestionItem}
                        onClick={() => handleSelectChannel(channel.handle)}
                      >
                        <div className={styles.suggestionItemContent}>
                          {channel.photoUrl ? (
                            <img
                              src={channel.photoUrl}
                              alt={channel.title || `@${channel.handle}`}
                              className={styles.suggestionAvatar}
                            />
                          ) : (
                            <div className={styles.suggestionAvatarFallback}>
                              @
                            </div>
                          )}
                          <div className={styles.suggestionText}>
                            <div className={styles.suggestionTitle}>
                              {channel.title || `@${channel.handle}`}
                            </div>
                            <div className={styles.suggestionHandle}>@{channel.handle}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {!isSuggestLoading &&
                      channelSuggestions.length === 0 &&
                      lastFetchedQuery === searchQuery && (
                        <div className={styles.suggestionStatus}>
                          <span>Нет подходящих каналов</span>
                        </div>
                      )}
                  </div>
                )}
              </div>
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
                        { value: '1d', label: '1 день' },
                        { value: '3d', label: '3 дня' },
                        { value: '7d', label: '1 неделя' },
                        { value: '30d', label: '1 месяц' },
                        { value: 'custom', label: 'Свой период' },
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
