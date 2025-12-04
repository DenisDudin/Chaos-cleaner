// AICODE-NOTE: Менеджер для управления Telegram клиентом (singleton)
// Обеспечивает единый экземпляр клиента и управление сессией
import { TelegramClient } from 'telegram';
import { createTelegramClient, getSessionString } from './telegram-client';
import * as fs from 'fs';
import * as path from 'path';

// AICODE-TODO: Добавить обработку ошибок при сохранении/загрузке сессии
// AICODE-TODO: Добавить автоматическое переподключение при разрыве соединения

let telegramClient: TelegramClient | null = null;
const SESSION_FILE_PATH = process.env.TELEGRAM_SESSION_PATH || './data/telegram_session.txt';

/**
 * Загружает сохраненную сессию из файла
 */
function loadSession(): string | null {
  try {
    const sessionDir = path.dirname(SESSION_FILE_PATH);
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    if (fs.existsSync(SESSION_FILE_PATH)) {
      return fs.readFileSync(SESSION_FILE_PATH, 'utf-8').trim();
    }
  } catch (error) {
    console.error('Ошибка при загрузке сессии:', error);
  }
  return null;
}

/**
 * Сохраняет сессию в файл
 */
async function saveSession(client: TelegramClient): Promise<void> {
  try {
    const sessionString = await getSessionString(client);
    const sessionDir = path.dirname(SESSION_FILE_PATH);
    
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    fs.writeFileSync(SESSION_FILE_PATH, sessionString, 'utf-8');
    console.log('Сессия сохранена в', SESSION_FILE_PATH);
  } catch (error) {
    console.error('Ошибка при сохранении сессии:', error);
    // AICODE-TODO: Не прерывать выполнение, но логировать ошибку
  }
}

/**
 * Получает или создает Telegram клиент
 */
export async function getTelegramClient(): Promise<TelegramClient> {
  if (telegramClient && await telegramClient.checkAuthorization()) {
    return telegramClient;
  }

  const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
  const apiHash = process.env.TELEGRAM_API_HASH || '';
  const phone = process.env.TELEGRAM_PHONE;

  // Проверяем наличие обязательных переменных окружения
  const missingVars: string[] = [];
  if (!apiId || apiId === 0) {
    missingVars.push('TELEGRAM_API_ID');
  }
  if (!apiHash) {
    missingVars.push('TELEGRAM_API_HASH');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}\n` +
      `Убедитесь, что файл back/.env существует и содержит эти переменные.\n` +
      `См. back/README-TELEGRAM-SETUP.md для инструкций по настройке.`
    );
  }

  const sessionString = loadSession();

  console.log('Инициализация Telegram клиента...');
  telegramClient = await createTelegramClient({
    apiId,
    apiHash,
    sessionString: sessionString || undefined,
    phone: phone || undefined,
  });

  // Сохраняем сессию после успешной авторизации
  await saveSession(telegramClient);

  return telegramClient;
}

/**
 * Закрывает соединение с Telegram
 */
export async function disconnectTelegramClient(): Promise<void> {
  if (telegramClient) {
    await telegramClient.disconnect();
    telegramClient = null;
  }
}

