import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'navy' | 'gold' | 'outline';
  size?: 'sm' | 'md';
}

const variants = {
  default:  'bg-gray-100 text-gray-600',
  success:  'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning:  'bg-amber-50 text-amber-700 border border-amber-100',
  danger:   'bg-red-50 text-red-600 border border-red-100',
  accent:   'bg-accent-50 text-accent-700 border border-accent-100',
  navy:     'bg-navy-900 text-white',
  gold:     'bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-bold',
  outline:  'border border-gray-200 text-gray-600 bg-transparent',
};

export function Badge({ variant = 'default', size = 'sm', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3.5 py-1',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
