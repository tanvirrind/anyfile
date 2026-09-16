import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, subtitle, icon }) => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      </div>
      {icon && <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">{icon}</div>}
    </div>
  );
};
