// AICODE-NOTE: Клиент для работы с Telegram API через MTProto (gramjs)
// Использует библиотеку telegram (gramjs) для работы с Telegram Client API
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import * as readline from 'readline';

// AICODE-TODO: Добавить обработку ошибок сети и таймаутов
// AICODE-TODO: Добавить retry логику для rate limits
// AICODE-TODO: Добавить кэширование сессий для избежания повторной авторизации

interface TelegramClientConfig {
  apiId: number;
  apiHash: string;
  sessionString?: string;
  phone?: string;
}

/**
 * Создает и инициализирует Telegram клиент
 */
export async function createTelegramClient(
  config: TelegramClientConfig
): Promise<TelegramClient> {
  const { apiId, apiHash, sessionString, phone } = config;

  const session = new StringSession(sessionString || '');
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });

  // Подключаемся к Telegram
  await client.connect();

  // Проверяем, авторизован ли клиент
  if (!(await client.checkAuthorization())) {
    if (!phone) {
      throw new Error('Требуется номер телефона для авторизации. Укажите TELEGRAM_PHONE в .env');
    }

    console.log(`Отправка кода подтверждения на номер ${phone}...`);
    
    // Используем метод start() для авторизации
    // Он автоматически обработает отправку кода и вход
    await client.start({
      phoneNumber: phone,
      password: async () => {
        // Если требуется пароль 2FA
        console.log('Требуется пароль двухфакторной аутентификации...');
        return await askForPassword();
      },
      phoneCode: async () => {
        // Запрашиваем код у пользователя через консоль
        return await askForCode();
      },
      onError: (err) => {
        console.error('Ошибка авторизации:', err);
      },
    });
  }

  console.log('Telegram клиент успешно авторизован');
  return client;
}

/**
 * Запрашивает код подтверждения у пользователя через консоль
 */
function askForCode(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Введите код подтверждения из Telegram: ', (code) => {
      rl.close();
      resolve(code.trim());
    });
  });
}

/**
 * Запрашивает пароль 2FA у пользователя через консоль
 */
function askForPassword(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Введите пароль двухфакторной аутентификации: ', (password) => {
      rl.close();
      resolve(password.trim());
    });
  });
}

interface ChannelMessage {
  id: number;
  text: string;
  date: string;
  channel: string;
}

/**
 * Получает сообщения из канала за указанный период
 */
export async function getChannelMessages(
  client: TelegramClient,
  channelHandle: string,
  startDate: Date,
  endDate: Date
): Promise<ChannelMessage[]> {
  try {
    // Убираем @ если есть
    const cleanHandle = channelHandle.replace(/^@/, '');

    console.log(`Получение сообщений из канала ${cleanHandle}...`);

    // Получаем entity канала
    const entity = await client.getEntity(cleanHandle);

    if (!entity) {
      throw new Error(`Канал ${channelHandle} не найден или недоступен`);
    }

    const messages: ChannelMessage[] = [];
    let offsetId = 0;
    let hasMore = true;
    let requestCount = 0;
    const maxRequests = 50; // Ограничение для избежания rate limits

    // AICODE-TODO: Добавить задержки между запросами для избежания rate limits
    // AICODE-TODO: Оптимизировать пагинацию для больших каналов

    while (hasMore && requestCount < maxRequests) {
      const result = await client.getMessages(entity, {
        limit: 100,
        offsetId,
      });

      if (!result || result.length === 0) {
        hasMore = false;
        break;
      }

      requestCount++;

      for (const message of result) {
        if (!message.date) continue;

        // message.date это число (timestamp в секундах)
        const messageDate = new Date(message.date * 1000);

        // Если сообщение раньше начальной даты, прекращаем
        if (messageDate < startDate) {
          hasMore = false;
          break;
        }

        // Если сообщение в нужном диапазоне, добавляем его
        if (messageDate >= startDate && messageDate <= endDate) {
          messages.push({
            id: message.id,
            text: message.message || message.text || '',
            date: messageDate.toISOString(),
            channel: cleanHandle,
            // AICODE-TODO: Добавить обработку медиа и вложений
          });
        }

        // Обновляем offsetId для следующей итерации
        offsetId = message.id;
      }

      // Если получили меньше 100 сообщений, значит это последняя страница
      if (result.length < 100) {
        hasMore = false;
      }

      // Небольшая задержка между запросами
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Получено ${messages.length} сообщений из канала ${cleanHandle}`);

    // Сортируем по дате (от старых к новым)
    return messages.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    // AICODE-TODO: Добавить более детальную обработку ошибок
    if (error instanceof Error) {
      throw new Error(`Ошибка при парсинге канала ${channelHandle}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Получает строку сессии для сохранения
 */
export async function getSessionString(client: TelegramClient): Promise<string> {
  return (client.session as StringSession).save() as string;
}

