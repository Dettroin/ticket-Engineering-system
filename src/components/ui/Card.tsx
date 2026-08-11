import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm transition-all duration-200',
        hoverable && 'hover:border-slate-700 hover:shadow-dettroin-950/40 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
