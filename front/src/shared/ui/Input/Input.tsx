// AICODE-NOTE: Shadcn Input component wrapper with label, error, and helperText support
import { forwardRef } from 'react';
// @ts-ignore - импорт из shadcn (локальная копия)
import { Input as ShadcnInput } from '@/shared/ui/shadcn/input';
import { Label } from '../Label';
import { cn } from '@/shared/lib/utils';
import styles from './Input.module.css';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <Label
            htmlFor={props.id}
            className={styles.label}
          >
            {label}
          </Label>
        )}
        <ShadcnInput
          ref={ref}
          className={cn(error && styles.errorInput, className)}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <p className={styles.error}>{error}</p>
        )}
        {helperText && !error && (
          <p className={styles.helper}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
