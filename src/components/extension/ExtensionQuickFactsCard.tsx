import React from 'react';
import {
  FileText,
  Folder,
  Code,
  Calendar,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { FileTypeInfo } from '../../types';

interface ExtensionQuickFactsCardProps {
  item: FileTypeInfo;
}

export const ExtensionQuickFactsCard: React.FC<ExtensionQuickFactsCardProps> = ({ item }) => {
  const specs = item.specifications;
  const devName = specs?.developer || item.developer || 'Open Standard Working Group';
  const releaseYear = specs?.initialRelease || item.firstReleased || 'N/A';
  const licensing = specs?.licensing || (item.developer ? 'Proprietary / Patent Licensed' : 'Open Standard');
  const structureType = specs?.structureType || (item.magicBytesHex !== 'N/A' ? 'Binary Header Data' : 'Text / XML Data');

  const facts = [
    {
      label: 'File Extension',
      value: `.${item.extension}`,
      icon: FileText,
      highlight: true,
    },
    {
      label: 'Category',
      value: item.category,
      icon: Folder,
    },
    {
      label: 'MIME Type',
      value: item.mimeType,
      icon: Code,
      isMono: true,
    },
    {
      label: 'Developer / Owner',
      value: devName,
      icon: Cpu,
    },
    {
      label: 'First Released',
      value: releaseYear,
      icon: Calendar,
    },
    {
      label: 'Licensing Standard',
      value: licensing,
      icon: ShieldCheck,
    },
    {
      label: 'Format Structure',
      value: structureType,
      icon: Layers,
    },
    {
      label: 'Typical File Size',
      value: item.typicalSize,
      icon: Sparkles,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Specification & Metadata
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          .{item.extension}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                f.highlight
                  ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{f.label}</span>
              </div>
              <p
                className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate ${
                  f.isMono ? 'font-mono text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                {f.value}
              </p>
            </div>
          );
        })}
      </div>

      {item.exampleUse && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
          <span className="font-bold text-slate-900 dark:text-white shrink-0">Common Usage:</span>
          <span>{item.exampleUse}</span>
        </div>
      )}
    </div>
  );
};
