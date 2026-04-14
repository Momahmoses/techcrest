'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white shadow-sm hover:shadow-glow btn-shine focus-visible:ring-accent-400',
  secondary:
    'bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white shadow-sm focus-visible:ring-navy-600',
  outline:
    'border border-accent-500/70 text-accent-500 hover:bg-accent-500 hover:text-white hover:border-accent-500 hover:shadow-glow focus-visible:ring-accent-400',
  ghost:
    'text-navy-900 hover:bg-navy-900/6 focus-visible:ring-navy-400',
  danger:
    'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-sm focus-visible:ring-red-400',
  gold:
    'bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-bold shadow-sm hover:shadow-glow-gold btn-shine focus-visible:ring-gold-400',
};

const sizes = {
  sm:  'h-8   px-3.5 text-xs   rounded-lg  gap-1.5',
  md:  'h-10  px-4.5 text-sm   rounded-xl  gap-2',
  lg:  'h-12  px-6   text-sm   rounded-xl  gap-2',
  xl:  'h-14  px-8   text-base rounded-2xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold font-body',
        'transition-all duration-300 ease-spring',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Processing…
        </>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = 'Button';
