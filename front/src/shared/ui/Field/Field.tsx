// AICODE-NOTE: Field компонент на основе shadcn/ui FormField без Tailwind
import * as React from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/shared/lib/utils';
import styles from './Field.module.css';

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
  disabled?: boolean;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, invalid, disabled, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        data-invalid={invalid}
        data-disabled={disabled}
        {...props}
      />
    );
  }
);
Field.displayName = 'Field';

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label.Root>,
  React.ComponentPropsWithoutRef<typeof Label.Root>
>(({ className, ...props }, ref) => {
  return (
    <Label.Root
      ref={ref}
      className={cn('text-sm font-medium', styles.label, className)}
      {...props}
    />
  );
});
FieldLabel.displayName = 'FieldLabel';

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm', styles.description, className)}
      {...props}
    />
  );
});
FieldDescription.displayName = 'FieldDescription';

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    errors?: Array<{ message?: string }>;
  }
>(({ className, errors, ...props }, ref) => {
  if (!errors || errors.length === 0) return null;

  return (
    <p
      ref={ref}
      className={cn('text-sm', styles.error, className)}
      {...props}
    >
      {errors.map((error, index) => (
        <span key={index}>{error.message}</span>
      ))}
    </p>
  );
});
FieldError.displayName = 'FieldError';

export { Field, FieldLabel, FieldDescription, FieldError };

