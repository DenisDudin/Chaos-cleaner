// AICODE-NOTE: Используем Express для MVP вместо tRPC для упрощения настройки.
// В tech.md указан tRPC, но для начальной структуры Express проще.
// AICODE-TODO: Мигрировать на tRPC + Zod для типобезопасной связи фронт-бэк.

// Загружаем переменные окружения из .env файла
// AICODE-NOTE: dotenv должен быть импортирован ДО всех остальных модулей, которые используют process.env
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Определяем путь к .env файлу
// Пробуем несколько вариантов:
// 1. В текущей рабочей директории (если запускаем из back/)
// 2. Относительно __dirname (для скомпилированного кода)
// 3. В родительской директории (если запускаем из корня проекта)

let envPath = path.resolve(process.cwd(), '.env');

// Если файл не найден, пробуем другие варианты
if (!fs.existsSync(envPath)) {
  // Пробуем относительно __dirname (для скомпилированного кода в dist/)
  const envPathFromDirname = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPathFromDirname)) {
    envPath = envPathFromDirname;
  } else {
    // Пробуем в родительской директории (если запускаем из корня проекта)
    const envPathFromParent = path.resolve(process.cwd(), 'back/.env');
    if (fs.existsSync(envPathFromParent)) {
      envPath = envPathFromParent;
    }
  }
}

// Загружаем .env файл
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`⚠️  Не удалось загрузить .env файл из ${envPath}`);
  console.warn(`   Убедитесь, что файл существует. Ошибка: ${result.error.message}`);
} else {
  console.log(`✅ Переменные окружения загружены из ${envPath}`);
  // Проверяем наличие обязательных переменных (без вывода значений)
  const requiredVars = ['TELEGRAM_API_ID', 'TELEGRAM_API_HASH'];
  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.warn(`⚠️  Отсутствуют переменные: ${missing.join(', ')}`);
  }
}

import express from 'express';
import cors from 'cors';
import './shared/database'; // Инициализация БД
import { parseChannels } from './parsing/service';
import { ParseChannelsRequest } from './parsing/types';

const app = express();
const PORT = process.env.PORT || 3001;

// AICODE-TODO: Настроить CORS правильно для продакшена (указать конкретные домены)
app.use(cors());
app.use(express.json());

// Тестовый endpoint для проверки связи фронт-бэк
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Endpoint для парсинга каналов
app.post('/api/parse-channels', async (req, res) => {
  try {
    // AICODE-TODO: Добавить валидацию с помощью Zod для типобезопасности
    const { channels, startDate, endDate } = req.body;
    
    // Базовая валидация
    if (!channels || !Array.isArray(channels) || channels.length === 0) {
      return res.status(400).json({ 
        error: 'Не указаны каналы для парсинга' 
      });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Не указаны даты начала и конца периода' 
      });
    }
    
    const request: ParseChannelsRequest = {
      channels,
      startDate,
      endDate,
    };
    
    const result = await parseChannels(request);
    
    res.json(result);
  } catch (error) {
    // AICODE-TODO: Добавить структурированное логирование ошибок
    console.error('Ошибка при парсинге каналов:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    res.status(500).json({ 
      error: errorMessage 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

