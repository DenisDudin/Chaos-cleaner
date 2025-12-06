# TECH.md

## Проект

Проект представляет собой  **Telegram Mini App** 

---

## 1. Архитектура
* Простота, предсказуемость и тестируемость.
* FSD для фронтенда — модульность и масштабируемость UI.
* DDD‑подход на бэкенде — явные bounded contexts: parsing, aggregation, llm, presets, auth.
* Надёжное хранение источников и аудит действий.

---

## 2. Стек технологий
* Frontend: **React + TypeScript**, FSD, Radix UI (UI компоненты).
* Backend: **Node.js + TypeScript (Express)**.
* Типобезопасная связь: **tRPC + Zod**.
* DB: **Postgres**.
* Workers/Queue: BullMQ / альтернативы.
* LLM: провайдер‑адаптер (абстракция для разных API).
* Векторное хранилище (опционально): Pinecone/Milvus при RAG.
* CI/CD: GitHub Actions, Docker.
* Observability: structured logs, Sentry, метрики (Prometheus/Grafana).
* Tests: Jest, RTL, Supertest.
* Code quality: ESLint, Prettier, husky.

---

## 3. Высокоуровневая архитектура

* **Frontend (FSD):** features/, entities/, shared/, pages/. Каждый feature содержит UI, hooks, model, tests.
* **Backend (DDD):** модули/parsing, ingestion, aggregation, llm, presets, auth, audit — каждый со своим repository/service/entity.
* **Storage:** primary DB (posts, channels, presets, users, runs, audit_logs), blob storage для медиа, Redis для кеша/rate limits.
* **Workers:** парсинг каналов, pre‑processing, асинхронные LLM‑запросы.

### REST API (MVP)
* `POST /api/parse-channels` — парсинг сообщений каналов за период.
* `GET /api/channels/search?query=...&limit=5` — поиск публичных аккаунтов/каналов через MTProto (до 5 подсказок). Ответ: `{ channels: [{ handle, title, type, photoUrl? }] }`.

---

## 4. Data model (ключевые сущности)

* **User:** id, telegram_id, display_name, settings, created_at.
* **Channel:** id, handle, meta, last_fetched_at.
* **Post:** id, channel_id, message_id, text, attachments, published_at, raw_payload.
* **Preset:** id, user_id, name, channels[], prompt_template, time_range.
* **Run:** id, preset_id|null, input_posts[], prompt_used, llm_response, sources[], status.
* **AuditLog:** actor, action_type, details, created_at.

Все входы/выходы валидировать Zod‑схемами и использовать в tRPC.

---

## 5. LLM и prompt‑workflow

* **LLMProvider:** единый интерфейс (sendPrompt, stream, meta).
* **Assembly:** backend собирает контекст (посты + attribution + prompt template), обрезает/чанкит по токенам, при необходимости использует multi‑step (summarize→compose).
* **Attribution:** в ответе всегда перечислять источники (channel + post id + permalink).
* **Safety:** фильтры приватной информации, лимиты размера, rate limiting.
* **Caching:** Redis для частых/повторяющихся запросов.
* **Prompt templates:** версияция и хранение в БД.

---

## 6. UX / Frontend (FSD) — принципы

* Минимум кликов: Preset → Run → Result.
* Feature‑first: каждая фича — автономна и тестируема.
* Progressive loading: сначала метаданные, затем детали.
* Error‑first UX: понятные ошибки при rate limits, timeouts, недоступности LLM.
* A11y: базовые ARIA, keyboard support.

Пример структуры:

```
src/
  features/
    presets/
      ui/
      model/
      hooks/
  entities/
  shared/
  pages/
```

---

## 7. CI/CD и окружения

* Docker + docker‑compose для локалки.
* GitHub Actions: lint → test → build → image push.
* env: dev/staging/prod; секреты — в CI/vault.
* Миграции: prisma/migrate или аналог.

---

## 8. Безопасность и приватность

* Хранить ключи в секретах; не логировать секреты.
* По умолчанию работать только с публичными каналами; приватные — с явным согласием.
* Retention policy: configurable purge raw_payload.
* Quotas и rate limits по пользователям.

---

## 9. Тестирование

* Unit: core services.
* Integration: tRPC endpoints (mock Telegram/LLM).
* E2E: Playwright/Cypress для ключевых flows.

---

## 10. Observability & Audit

* Structured logs (json), error tracking (Sentry).
* Метрики: LLM calls, latencies, failures, queue lengths.
* AuditLog: все значимые действия (создание/обновление пресетов, массовые изменения, важные агентские действия).

---

## 11. Roadmap масштабирования

1. MVP: SQLite, single worker, single LLM provider.
2. Stage: Postgres, Redis, basic vector store.
3. Scale: разделение worker'ов, многопровайдерный LLM, sharding, autoscaling.

---

## 12. Operational checklist

* Secrets: Telegram & LLM настроены.
* CI: lint/tests pass.
* Docs: README + docs + AGENTS.md актуальны.
* Monitoring: базовый набор метрик и алертов.

---