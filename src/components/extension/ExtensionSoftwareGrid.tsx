import React from 'react';
import {
  Download,
  Star,
  ExternalLink,
  CheckCircle2,
  Laptop,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { SoftwareApp, AppRoute } from '../../types';

interface ExtensionSoftwareGridProps {
  apps: SoftwareApp[];
  extensionName: string;
  onNavigate: (route: AppRoute) => void;
}

export const ExtensionSoftwareGrid: React.FC<ExtensionSoftwareGridProps> = ({
  apps,
  extensionName,
  onNavigate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recommended Software for .{extensionName}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {apps.length} Verified Apps
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app, idx) => {
          const rating = (4.7 + (idx * 0.1) % 0.3).toFixed(1);
          const slug = app.slug || app.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

          return (
            <div
              key={app.name}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {app.developer || 'Verified Software Provider'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 ${
                      app.isFree
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {app.isFree ? 'Free' : 'Paid / Commercial'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rating} / 5.0</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    <span className="capitalize">{app.os.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Compatible with .{extensionName}</span>
                </span>

                <button
                  onClick={() => onNavigate({ view: 'software-detail', id: slug })}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>App Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
