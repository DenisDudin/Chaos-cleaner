// AICODE-NOTE: Используем FSD архитектуру для масштабируемости.
// Для MVP это может показаться избыточным, но структура позволит легко добавлять новые фичи.
import { useEffect, useState } from 'react';
import { apiClient } from '../../shared/api/client';

export const HomePage = () => {
  const [backendStatus, setBackendStatus] = useState<string>('checking...');

  useEffect(() => {
    // AICODE-TODO: Добавить обработку ошибок сети
    apiClient
      .health()
      .then((data) => {
        setBackendStatus(data.message || 'connected');
      })
      .catch((error) => {
        setBackendStatus(`error: ${error.message}`);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello World</h1>
      <p className="text-lg text-gray-600">Backend status: {backendStatus}</p>
    </div>
  );
};
