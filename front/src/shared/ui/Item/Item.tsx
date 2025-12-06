// AICODE-NOTE: Item компонент для использования в меню и списках без Tailwind
import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './Item.module.css';

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  interactive?: boolean;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, selected, interactive = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.item,
          interactive ? styles.interactive : styles.static,
          selected && styles.selected,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Item.displayName = 'Item';

export { Item };

