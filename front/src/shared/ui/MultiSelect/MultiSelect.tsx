// AICODE-NOTE: Компонент множественного выбора на основе Radix UI Popover без Tailwind
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Label from '@radix-ui/react-label';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '../Badge';
import styles from './MultiSelect.module.css';
import wrapperStyles from './MultiSelect.wrapper.module.css';

interface MultiSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const MultiSelect = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Выберите...',
  error,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  return (
    <div className={styles.wrapper}>
      {label && (
        <Label.Root className={`block text-sm font-medium mb-2 ${styles.label}`}>
          {label}
        </Label.Root>
      )}
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={cn(
              styles.trigger,
              error && styles.triggerError
            )}
            data-error={!!error}
          >
            <span
              className={cn(
                styles.triggerText,
                selected.length === 0 && styles.triggerPlaceholder
              )}
            >
              {selected.length === 0
                ? placeholder
                : selected.length === 1
                ? selectedOptions[0].label
                : `Выбрано: ${selected.length}`}
            </span>
            <ChevronDown
              className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')}
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(styles.menu, wrapperStyles.menuWrapper)}
            align="start"
            sideOffset={4}
          >
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(isSelected ? styles.optionSelected : styles.option, 'cursor-pointer')}
                  onClick={() => toggleOption(option.value)}
                >
                  <span className={styles.option}>{option.label}</span>
                  {isSelected && (
                    <Check className={`w-5 h-5 ${styles.check}`} />
                  )}
                </div>
              );
            })}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {selected.length > 0 && (
        <div className={styles.selectedList}>
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={cn('border-none bg-transparent p-0 inline-flex items-center cursor-pointer', styles.selectedBadge)}
            >
              <Badge variant="primary" className={styles.selectedBadge}>
                {option.label}
                <span className={styles.badgeIcon}>×</span>
              </Badge>
            </button>
          ))}
        </div>
      )}

      {error && <p className={`mt-1 text-sm ${styles.error}`}>{error}</p>}
    </div>
  );
};
