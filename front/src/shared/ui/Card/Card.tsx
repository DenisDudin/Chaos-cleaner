// AICODE-NOTE: Shadcn Card component wrapper with interactive support
// @ts-ignore - импорт из @ui (shadcn компоненты)
import { Card as ShadcnCard } from '@/shared/ui/shadcn/card';
import { cn } from '@/shared/lib/utils';
import styles from './Card.module.css';
import type { ReactNode, KeyboardEvent } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card = ({ children, className = '', onClick, interactive = false }: CardProps) => {
  return (
    <ShadcnCard
      className={cn(
        styles.card,
        interactive && styles.interactive,
        className
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive && onClick ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </ShadcnCard>
  );
};
