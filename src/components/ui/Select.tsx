import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-semibold text-navy-900 mb-1.5">{label}</label>}
        <select
          ref={ref}
          className={cn(
            'w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20 transition-all shadow-apple-sm',
            error && 'border-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
