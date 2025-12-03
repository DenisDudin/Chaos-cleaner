// AICODE-NOTE: Карточка для пресетов, истории и других элементов списка
import { ReactNode, useState } from 'react';
import { colors } from '../colors';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card = ({ children, className = '', onClick, interactive = false }: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles = 'p-4 transition-telegram shadow-sm';
  const style: React.CSSProperties = {
    backgroundColor: isHovered && interactive ? colors.dark.surfaceHover : colors.dark.surface,
    borderColor: isHovered && interactive ? `rgba(45, 212, 191, 0.3)` : colors.dark.border,
    borderRadius: colors.borderRadius.telegram,
    borderWidth: '1px',
    borderStyle: 'solid',
    cursor: interactive ? 'pointer' : 'default',
    transform: isHovered && interactive ? 'scale(0.98)' : 'scale(1)',
    boxShadow: isHovered && interactive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  };

  return (
    <div 
      className={`${baseStyles} ${className}`}
      style={style}
      onClick={onClick}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

