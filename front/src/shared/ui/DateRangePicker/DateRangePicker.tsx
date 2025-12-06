import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { Button } from '../Button';
import { Calendar } from '../Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import styles from './DateRangePicker.module.css';

interface DateRangePickerProps {
  value?: { from: Date | undefined; to: Date | undefined };
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DateRangePicker = ({
  value,
  onChange,
  placeholder = 'Выберите период',
  disabled,
}: DateRangePickerProps) => {
  const display = value?.from
    ? value.to
      ? `${format(value.from, 'dd.MM.yyyy')} — ${format(value.to, 'dd.MM.yyyy')}`
      : format(value.from, 'dd.MM.yyyy')
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          data-empty={!value?.from}
          className={cn(styles.button, !value?.from && styles.placeholder)}
          disabled={disabled}
        >
          <div className={styles.dates}>
            <span>
              <CalendarIcon className={styles.icon} />
              {display || placeholder}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent} align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
};

