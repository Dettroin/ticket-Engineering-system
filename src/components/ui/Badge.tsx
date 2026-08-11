import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-rounded font-semibold rounded-full border transition-all duration-150';

  const variants = {
    default: 'bg-navy-950 text-white border-navy-900',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/90',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/90',
    info: 'bg-blue-50 text-blue-700 border-blue-200/90',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/90',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
