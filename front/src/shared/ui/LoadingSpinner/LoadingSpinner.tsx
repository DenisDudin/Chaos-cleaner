// AICODE-NOTE: Компонент загрузки на чистом CSS без Tailwind
import { cn } from '@/shared/lib/utils';
import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  return <div className={cn(styles.spinner, styles[size])} />;
};
