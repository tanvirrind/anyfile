import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', size = 'sm' }) => {
  const variantStyles = {
    blue: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    amber: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    violet: 'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900',
    rose: 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px] font-semibold',
    md: 'px-3 py-1 text-xs font-bold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};
