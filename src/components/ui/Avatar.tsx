import React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md', className }) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover border border-slate-700/60 shadow-sm shrink-0', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-tr from-dettroin-700 to-indigo-600 text-white font-semibold flex items-center justify-center border border-slate-700/60 shadow-sm shrink-0',
        sizeMap[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
