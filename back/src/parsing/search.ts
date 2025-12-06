// AICODE-NOTE: Поиск аккаунтов/каналов в Telegram через MTProto contacts.search (gramjs)
import { Api, TelegramClient } from 'telegram';
import { Buffer } from 'buffer';
import { getTelegramClient } from './telegram-manager';

export type TelegramAccountType = 'user' | 'channel' | 'chat';

export interface TelegramAccountSuggestion {
  handle: string;
  title: string;
  type: TelegramAccountType;
  photoUrl?: string;
}

const DEFAULT_LIMIT = 5;

function normalizeHandle(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^@/, '');
  return cleaned.length ? cleaned : null;
}

function upToLimit(requested?: number | null): number {
  const value = typeof requested === 'number' && !Number.isNaN(requested) ? requested : DEFAULT_LIMIT;
  // AICODE-NOTE: Жестко ограничиваем до 5 для избежания лишних запросов и rate-limit.
  return Math.min(Math.max(value, 1), DEFAULT_LIMIT);
}

function extractFromUser(user: Api.TypeUser): TelegramAccountSuggestion | null {
  if (!(user instanceof Api.User)) return null;
  const handle = normalizeHandle(user.username);
  if (!handle) return null;
  const nameParts = [user.firstName, user.lastName].filter(Boolean);
  const title = nameParts.join(' ').trim() || `@${handle}`;
  return {
    handle,
    title,
    type: 'user',
  };
}

function extractFromChat(chat: Api.TypeChat): TelegramAccountSuggestion | null {
  if (chat instanceof Api.Channel) {
    const handle = normalizeHandle(chat.username);
    if (!handle) return null;
    return {
      handle,
      title: chat.title || `@${handle}`,
      type: 'channel',
    };
  }

  if (chat instanceof Api.Chat) {
    // Обычные чаты обычно без username — пропускаем.
    const handle = normalizeHandle((chat as unknown as { username?: string }).username);
    if (!handle) return null;
    return {
      handle,
      title: chat.title || `@${handle}`,
      type: 'chat',
    };
  }

  return null;
}

async function fetchPhotoDataUrl(
  client: TelegramClient,
  entity: Api.TypeUser | Api.TypeChat
): Promise<string | undefined> {
  try {
    const file = await client.downloadProfilePhoto(entity, { isBig: false });
    if (!file) return undefined;
    const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file);
    // AICODE-TODO: Кэшировать аватары, чтобы не дергать Telegram при каждом вводе.
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch (error) {
    // Не считаем отсутствие фото ошибкой, просто пропускаем
    return undefined;
  }
}

export async function searchTelegramAccounts(
  query: string,
  limit?: number
): Promise<TelegramAccountSuggestion[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    throw new Error('Пустой запрос');
  }

  const client: TelegramClient = await getTelegramClient();
  const cappedLimit = upToLimit(limit);

  const found = await client.invoke(
    new Api.contacts.Search({
      q: cleanQuery,
      limit: cappedLimit,
    })
  );

  const collected = new Map<
    string,
    { suggestion: TelegramAccountSuggestion; entity: Api.TypeUser | Api.TypeChat }
  >();

  const tryAdd = (
    suggestion: TelegramAccountSuggestion | null,
    entity: Api.TypeUser | Api.TypeChat
  ) => {
    if (!suggestion) return;
    if (collected.has(suggestion.handle)) return;
    collected.set(suggestion.handle, { suggestion, entity });
  };

  // Пользователи
  for (const user of found.users ?? []) {
    tryAdd(extractFromUser(user), user);
  }

  // Каналы/чаты
  for (const chat of found.chats ?? []) {
    tryAdd(extractFromChat(chat), chat);
  }

  const limited = Array.from(collected.values()).slice(0, cappedLimit);

  const withPhotos = await Promise.all(
    limited.map(async ({ suggestion, entity }) => {
      const photoUrl = await fetchPhotoDataUrl(client, entity);
      return photoUrl ? { ...suggestion, photoUrl } : suggestion;
    })
  );

  return withPhotos;
}

