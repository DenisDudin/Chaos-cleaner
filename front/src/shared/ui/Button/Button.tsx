// AICODE-NOTE: Базовый компонент кнопки с поддержкой доступности и Telegram UI guidelines
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

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
  
  const getVariantStyles = (variant: string) => {
    const base = 'text-white';
    switch (variant) {
      case 'primary':
        return {
          className: `${base} shadow-lg`,
          style: {
            backgroundColor: '#0f766e',
            boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.2)',
          },
          hover: { backgroundColor: '#0d9488' },
          active: { backgroundColor: '#115e59' },
        };
      case 'secondary':
        return {
          className: `${base} border`,
          style: {
            backgroundColor: '#1a1a1a',
            borderColor: '#333333',
            color: '#ffffff',
          },
          hover: { backgroundColor: '#262626', borderColor: 'rgba(45, 212, 191, 0.5)' },
        };
      case 'ghost':
        return {
          className: '',
          style: { color: '#2dd4bf' },
          hover: { backgroundColor: '#1a1a1a' },
          active: { backgroundColor: '#262626' },
        };
      case 'danger':
        return {
          className: base,
          style: { backgroundColor: '#dc2626' },
          hover: { backgroundColor: '#b91c1c' },
          active: { backgroundColor: '#991b1b' },
        };
      default:
        return { className: base, style: {}, hover: {}, active: {} };
    }
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-touch-sm',
    md: 'px-4 py-3 text-base min-h-touch',
    lg: 'px-6 py-4 text-lg min-h-touch',
  };

  const variantStyles = getVariantStyles(variant);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const currentStyle = {
    ...variantStyles.style,
    ...(isHovered ? variantStyles.hover : {}),
    ...(isActive ? variantStyles.active : {}),
    borderRadius: '12px',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles.className} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {children}
    </button>
  );
};

