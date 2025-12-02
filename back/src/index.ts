// AICODE-NOTE: Используем Express для MVP вместо tRPC для упрощения настройки.
// В tech.md указан tRPC, но для начальной структуры Express проще.
// AICODE-TODO: Мигрировать на tRPC + Zod для типобезопасной связи фронт-бэк.
import express from 'express';
import cors from 'cors';
import './shared/database'; // Инициализация БД

const app = express();
const PORT = process.env.PORT || 3001;

// AICODE-TODO: Настроить CORS правильно для продакшена (указать конкретные домены)
app.use(cors());
app.use(express.json());

// Тестовый endpoint для проверки связи фронт-бэк
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

