# Chaos-cleaner

Telegram Mini App для анализа и сводок из Telegram-каналов с использованием LLM.

## Структура проекта

```
ChaosCleaner/
├── front/          # Frontend (React + TypeScript, FSD)
├── back/           # Backend (Node.js + TypeScript, Express, SQLite)
├── docs/           # Документация (product.md, tech.md)
├── plans/          # Планы разработки
└── README.md       # Этот файл
```

## Быстрый старт

### Предварительные требования

- Node.js 18+ и npm
- Git

### Установка и запуск

#### Frontend

```bash
cd front
npm install
npm run dev
```

#### Backend

```bash
cd back
npm install
npm run dev
```

### Проверка работы

1. Запустите backend (`cd back && npm run dev`)
2. Запустите frontend (`cd front && npm run dev`)
3. Откройте браузер на адресе, указанном Vite (обычно `http://localhost:5173`)

## Технологии

- **Frontend**: React 19, TypeScript, Vite, Radix UI, FSD архитектура
- **Backend**: Node.js, TypeScript, Express, SQLite (better-sqlite3)
- **Связь**: REST API (в будущем планируется миграция на tRPC)

## Документация

Подробная документация находится в папке `docs/`:
- `docs/product.md` - описание продукта и пользовательских сценариев
- `docs/tech.md` - техническая архитектура и стек технологий

## Разработка

См. `CLAUDE.md` (AGENTS.md) для правил работы с проектом и использования AICODE-комментариев.
