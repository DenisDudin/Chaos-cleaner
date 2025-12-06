// AICODE-NOTE: Бейдж без Tailwind
import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  return (
    <span
      className={cn(
        styles.badge,
        {
          [styles.primary]: variant === 'primary',
          [styles.success]: variant === 'success',
          [styles.warning]: variant === 'warning',
          [styles.default]: variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
