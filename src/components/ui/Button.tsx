import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98] shadow-apple-sm';

  const variants = {
    primary: 'bg-navy-950 hover:bg-navy-900 text-white shadow-navy-glow border border-navy-900',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-navy-950 border border-slate-200',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-apple-sm',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-700 hover:text-navy-950 shadow-none',
    glass: 'bg-white/80 hover:bg-white text-navy-950 backdrop-blur-xl border border-slate-200/80 shadow-apple-sm',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 rounded-2xl',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
