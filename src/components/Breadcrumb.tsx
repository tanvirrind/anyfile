import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { AppRoute } from '../types';

export interface BreadcrumbItem {
  label: string;
  route?: AppRoute;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (route: AppRoute) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-1 flex items-center overflow-x-auto text-xs font-medium text-slate-500 dark:text-slate-400 no-scrollbar">
      <ol className="flex items-center space-x-2 shrink-0">
        <li>
          <button
            onClick={() => onNavigate({ view: 'home' })}
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            id="breadcrumb-home-btn"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center space-x-2 shrink-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
              {isLast || !item.route ? (
                <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.route && onNavigate(item.route)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  id={`breadcrumb-item-${idx}`}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
