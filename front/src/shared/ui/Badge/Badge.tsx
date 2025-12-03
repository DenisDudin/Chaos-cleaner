// AICODE-NOTE: Бейдж для отображения меток (каналы, статусы и т.д.)
import { type ReactNode } from 'react';
import { colors } from '../colors';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'rgba(15, 118, 110, 0.3)',
          color: colors.primary[400],
          borderColor: 'rgba(45, 212, 191, 0.3)',
        };
      case 'success':
        return {
          backgroundColor: 'rgba(22, 163, 74, 0.2)',
          color: '#4ade80',
          borderColor: 'rgba(74, 222, 128, 0.3)',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(202, 138, 4, 0.2)',
          color: '#fbbf24',
          borderColor: 'rgba(251, 191, 36, 0.3)',
        };
      default:
        return {
          backgroundColor: colors.dark.surfaceHover,
          color: colors.dark.textSecondary,
          borderColor: colors.dark.border,
        };
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
      style={getVariantStyle()}
    >
      {children}
    </span>
  );
};

