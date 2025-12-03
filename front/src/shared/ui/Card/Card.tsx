// AICODE-NOTE: Карточка для пресетов, истории и других элементов списка
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card = ({ children, className = '', onClick, interactive = false }: CardProps) => {
  const baseStyles = 'bg-dark-surface border border-dark-border rounded-telegram p-4 transition-telegram';
  const interactiveStyles = interactive 
    ? 'cursor-pointer hover:bg-dark-surfaceHover active:scale-[0.98]' 
    : '';

  return (
    <div 
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive && onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

