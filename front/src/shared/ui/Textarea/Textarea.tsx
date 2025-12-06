// AICODE-NOTE: Shadcn Textarea component wrapper with label, error, and helperText support
import { forwardRef } from 'react';
// @ts-ignore - импорт из shadcn (локальная копия)
import { Textarea as ShadcnTextarea } from '@/shared/ui/shadcn/textarea';
import { Label } from '../Label';
import { cn } from '@/shared/lib/utils';
import styles from './Textarea.module.css';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <ShadcnTextarea
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

Textarea.displayName = 'Textarea';
