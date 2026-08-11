import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  size = 'md',
  className,
  ...props
}) => {
  const getInitials = (n: string) => {
    const parts = n.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const sizes = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-navy-950 text-white font-bold font-sf-display flex items-center justify-center border border-navy-900 shrink-0 shadow-apple-sm select-none',
        sizes[size],
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
};
