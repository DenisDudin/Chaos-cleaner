// AICODE-NOTE: Сервис для парсинга Telegram каналов через MTProto
import { Post, ParseChannelsRequest, ParseChannelsResponse } from './types';
import { getTelegramClient } from './telegram-manager';
import { getChannelMessages } from './telegram-client';


/**
 * Парсит посты из указанных каналов за указанный период
 */
export async function parseChannels(
  request: ParseChannelsRequest
): Promise<ParseChannelsResponse> {
  const { channels, startDate, endDate } = request;
  
  // Валидация входных данных
  if (!channels || channels.length === 0) {
    throw new Error('Не указаны каналы для парсинга');
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Неверный формат даты');
  }
  
  if (start > end) {
    throw new Error('Начальная дата должна быть раньше конечной');
  }
  
  // Проверка максимального диапазона (30 дней для MVP)
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 30) {
    throw new Error('Максимальный период парсинга - 30 дней');
  }
  
  // Получаем Telegram клиент
  const client = await getTelegramClient();
  
  // Парсим каждый канал
  const allPosts: Post[] = [];
  
  for (const channel of channels) {
    try {
      console.log(`Парсинг канала: ${channel}`);
      const channelMessages = await getChannelMessages(client, channel, start, end);
      
      // Преобразуем сообщения в формат Post
      const posts: Post[] = channelMessages.map(msg => ({
        channel: msg.channel,
        messageId: msg.id,
        text: msg.text,
        date: msg.date,
        // AICODE-TODO: Добавить обработку медиа и вложений из message
      }));
      
      allPosts.push(...posts);
      console.log(`Получено ${posts.length} постов из канала ${channel}`);
    } catch (error) {
      console.error(`Ошибка при парсинге канала ${channel}:`, error);
      // AICODE-TODO: Добавить более детальную обработку ошибок (канал недоступен, нет прав и т.д.)
      // Продолжаем парсинг других каналов даже если один не удался
      // В случае ошибки можно вернуть частичные результаты или выбросить ошибку
    }
  }
  
  if (allPosts.length === 0) {
    console.warn('Не удалось получить посты ни из одного канала');
  }
  
  return {
    posts: allPosts,
    totalCount: allPosts.length,
    channels,
    startDate,
    endDate,
  };
}

