import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "../Button"
import { Calendar } from "../Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Popover"
import styles from "./DatePicker.module.css"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const DatePicker = ({
  date,
  onDateChange,
  placeholder = "Выберите дату",
  className,
  disabled,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          data-empty={!date}
          className={cn(
            styles.button,
            !date && styles.empty,
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className={styles.icon} />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent} align="start">
        <Calendar mode="single" selected={date} onSelect={onDateChange} />
      </PopoverContent>
    </Popover>
  )
}
