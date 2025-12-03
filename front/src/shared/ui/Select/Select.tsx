// AICODE-NOTE: Компонент выбора для временных промежутков и других опций
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-textSecondary mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 min-h-touch
            bg-dark-surface border border-dark-border 
            rounded-telegram 
            text-dark-text
            focus-ring
            transition-telegram
            cursor-pointer
            ${error ? 'border-red-500 focus:ring-red-500' : 'focus:border-primary-600'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark-surface">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-dark-textMuted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

