// AICODE-NOTE: Компонент выбора на основе Radix UI Select без Tailwind
import { useState } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/shared/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import styles from './Select.module.css';
import wrapperStyles from './Select.wrapper.module.css';

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select = ({
  label,
  error,
  helperText,
  options,
  value,
  onValueChange,
  placeholder = 'Выберите...',
  className = '',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {label && (
        <Label.Root className={`block text-sm font-medium mb-2 ${styles.label}`}>
          {label}
        </Label.Root>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} open={isOpen} onOpenChange={setIsOpen}>
        <SelectPrimitive.Trigger
          className={cn(
            styles.trigger,
            error && styles.triggerError,
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDown className={styles.chevron} />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(styles.menu, wrapperStyles.menuWrapper)}
            >
              <SelectPrimitive.Viewport className={styles.viewport}>
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'px-4 py-3 min-h-touch text-left',
                      'transition-telegram flex items-center justify-between',
                      'cursor-pointer rounded-md',
                      'hover:bg-dark-surface-hover',
                      'focus:bg-dark-surface-hover focus:outline-none',
                      styles.item
                    )}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator>
                      <Check className={styles.checkIcon} />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && (
          <p className={`mt-1 text-sm ${styles.error}`}>{error}</p>
        )}
        {helperText && !error && (
          <p className={`mt-1 text-sm ${styles.helper}`}>{helperText}</p>
        )}
      </div>
    );
};

Select.displayName = 'Select';
