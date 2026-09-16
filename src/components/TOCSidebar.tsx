import React, { useState } from 'react';
import { List, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface TOCItem {
  id: string;
  label: string;
}

interface TOCSidebarProps {
  items: TOCItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  title?: string;
}

export const TOCSidebar: React.FC<TOCSidebarProps> = ({
  items,
  activeId,
  onSelect,
  title = 'On This Page',
}) => {
  const [copied, setCopied] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    setMobileExpanded(false);
  };

  const activeItem = items.find((i) => i.id === activeId) || items[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 sticky top-20 shadow-xs space-y-3 z-30">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Copy page link"
            id="toc-copy-link-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px] font-medium">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Mobile Collapse Toggle */}
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
            id="toc-mobile-toggle-btn"
          >
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Current Active Selector Display */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between"
        >
          <span className="line-clamp-1">Section: {activeItem?.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation list */}
      <nav className={`space-y-1 text-xs sm:text-sm ${mobileExpanded ? 'block' : 'hidden lg:block'}`}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold border-l-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
              id={`toc-item-${item.id}`}
            >
              <span className="line-clamp-1">{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 ml-2"></span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

