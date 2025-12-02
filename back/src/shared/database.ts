// AICODE-NOTE: Используем SQLite для MVP вместо Postgres (как указано в tech.md).
// SQLite проще для начальной разработки, миграция на Postgres будет позже.
// AICODE-TODO: Мигрировать на Postgres при масштабировании (см. tech.md раздел 11).
import Database from 'better-sqlite3';

const dbPath = process.env.DB_PATH || './data/chaoscleaner.db';

// AICODE-TODO: Добавить миграции для создания схемы БД
// AICODE-TODO: Добавить обработку ошибок при инициализации БД
export const db = new Database(dbPath);

// Инициализация БД (базовая структура для будущего)
db.exec(`
  -- Пока оставляем пустым, структура будет добавлена позже
  -- См. tech.md раздел 4 для описания сущностей
`);

console.log('Database initialized at:', dbPath);


