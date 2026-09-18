import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileSearch,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { FileTypeInfo } from '../../types';

interface ExtensionSecurityCardProps {
  item: FileTypeInfo;
}

export const ExtensionSecurityCard: React.FC<ExtensionSecurityCardProps> = ({ item }) => {
  const isLowRisk = item.dangerRating === 'Low Risk';
  const isMediumRisk = item.dangerRating === 'Medium Risk';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLowRisk
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Security & Malware Risk Assessment
          </h2>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            isLowRisk
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
          }`}
        >
          {item.dangerRating}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-500" />
              <span>Can a .{item.extension} file carry viruses or malware?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.dangerExplanation ||
                `Standard .${item.extension} files primarily store media or document data. However, attackers sometimes disguise executable malware by using double extensions (e.g., file.${item.extension}.exe).`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Executable Macros</span>
              </div>
              <p className="text-xs text-slate-500">
                {isLowRisk ? 'No active macro execution support' : 'May support scripting or automation macros'}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Lock className="w-4 h-4" />
                <span>Sandboxed Parsing</span>
              </div>
              <p className="text-xs text-slate-500">
                Safe to inspect with AnyFileX's browser sandbox
              </p>
            </div>
          </div>
        </div>

        {/* Security Checklist Card */}
        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Safety Checklist Before Opening</span>
          </div>

          <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">•</span>
              <span>Verify file extension in OS File Explorer options ('Show known file extensions').</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">•</span>
              <span>Verify magic bytes ({item.magicBytesHex}) to ensure the file isn't a renamed executable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">•</span>
              <span>Do not open .{item.extension} attachments received unexpectedly via email or instant messenger.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
