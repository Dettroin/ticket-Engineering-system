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
        'bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-apple-sm transition-all duration-200',
        hoverable && 'hover:border-navy-300 hover:shadow-apple-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
