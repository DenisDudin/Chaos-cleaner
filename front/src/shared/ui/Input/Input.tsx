// AICODE-NOTE: Компонент ввода с поддержкой тёмной темы и доступности
import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { colors } from '../colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: colors.dark.surface,
      borderColor: error ? '#ef4444' : (isFocused ? colors.primary[400] : colors.dark.border),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: colors.borderRadius.telegram,
      color: colors.dark.text,
      outline: 'none',
      boxShadow: isFocused && !error ? `0 0 0 2px rgba(45, 212, 191, 0.2)` : 'none',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2" style={{ color: colors.dark.textSecondary }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full transition-telegram ${className}`}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={props.placeholder}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm" style={{ color: '#f87171' }}>{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: colors.dark.textMuted }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

