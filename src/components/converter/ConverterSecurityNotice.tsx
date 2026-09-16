import React from 'react';
import { ShieldCheck, Lock, Cpu, Trash2 } from 'lucide-react';

export const ConverterSecurityNotice: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 text-slate-800 dark:text-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>100% Private In-Browser Conversion</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                Zero Server Uploads
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your files are decoded and re-encoded locally inside your WebAssembly browser RAM. No bytes touch remote servers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0 border-t sm:border-t-0 sm:border-l border-emerald-200 dark:border-emerald-800 pt-2 sm:pt-0 sm:pl-4">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>RAM Only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Client Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Auto Deleted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
