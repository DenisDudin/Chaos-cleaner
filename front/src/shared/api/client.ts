// AICODE-NOTE: Простой fetch-based клиент для MVP.
// В tech.md указан tRPC, но для начальной структуры используем простой fetch.
// AICODE-TODO: Мигрировать на tRPC клиент для типобезопасной связи с бэкендом.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = {
  async health() {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error('Failed to fetch health status');
    }
    return response.json();
  },
};


