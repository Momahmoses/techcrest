import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'dark' | 'gradient';
}

export function Card({
  hover = false,
  padding = 'md',
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variant === 'default'  && 'bg-white border border-gray-100/80 shadow-card',
        variant === 'glass'    && 'glass',
        variant === 'dark'     && 'glass-dark',
        variant === 'gradient' && 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-100 shadow-card',
        hover && 'hover-lift cursor-pointer',
        padding === 'none' && 'p-0',
        padding === 'sm'   && 'p-4',
        padding === 'md'   && 'p-6',
        padding === 'lg'   && 'p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
