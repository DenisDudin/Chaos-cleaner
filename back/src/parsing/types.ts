// AICODE-NOTE: Типы данных для модуля парсинга каналов

export interface Post {
  channel: string;
  messageId: number;
  text: string;
  date: string; // ISO date string
  attachments?: string[]; // URLs или типы вложений
}

export interface ParseChannelsRequest {
  channels: string[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ParseChannelsResponse {
  posts: Post[];
  totalCount: number;
  channels: string[];
  startDate: string;
  endDate: string;
}

