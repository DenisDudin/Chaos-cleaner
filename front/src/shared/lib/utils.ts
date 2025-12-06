// AICODE-NOTE: Утилита для объединения классов (аналог cn из shadcn/ui, но без Tailwind)
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


