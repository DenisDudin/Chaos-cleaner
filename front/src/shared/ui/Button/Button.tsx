// AICODE-NOTE: Базовый компонент кнопки с поддержкой доступности и Telegram UI guidelines
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-telegram transition-telegram focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800',
    secondary: 'bg-dark-surface text-dark-text border border-dark-border hover:bg-dark-surfaceHover',
    ghost: 'text-primary-400 hover:bg-dark-surface active:bg-dark-surfaceHover',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-touch-sm',
    md: 'px-4 py-3 text-base min-h-touch',
    lg: 'px-6 py-4 text-lg min-h-touch',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

