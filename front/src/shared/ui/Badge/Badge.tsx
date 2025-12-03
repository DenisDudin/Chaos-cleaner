// AICODE-NOTE: Бейдж для отображения меток (каналы, статусы и т.д.)
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-dark-surfaceHover text-dark-textSecondary',
    primary: 'bg-primary-700/20 text-primary-400',
    success: 'bg-green-600/20 text-green-400',
    warning: 'bg-yellow-600/20 text-yellow-400',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 
        rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

