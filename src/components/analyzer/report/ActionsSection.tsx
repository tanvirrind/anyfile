import React from 'react';
import {
  Zap,
  Cpu,
  Hash,
  HelpCircle,
  RefreshCw,
  FileText,
  Scale,
  Search,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import type { AppRoute } from '../../../types';
import type { FileAnalysis } from '../../../lib/analyzer/types';
import { getOpenersByOS, OPENER_OS_LABELS } from '../../../lib/database/softwareEngine';

interface ActionsSectionProps {
  analysis: FileAnalysis;
  onNavigate: (route: AppRoute) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-4 h-4" />,
  Hash: <Hash className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
};

function ActionIcon({ name }: { name: string }) {
  return <>{ICON_MAP[name] ?? <Zap className="w-4 h-4" />}</>;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({ analysis, onNavigate }) => {
  const detectedExt = (analysis.detectedExtension || '').toLowerCase();
  const hasKnownExt = detectedExt && detectedExt !== 'unknown' && detectedExt !== 'bin';
  const openers = hasKnownExt ? getOpenersByOS(detectedExt) : null;
  const osKeys = (['windows', 'mac', 'linux', 'ios', 'android'] as const).filter(
    (os) => openers && openers[os].length > 0
  );

  return (
    <section
      id="actions"
      className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Wrench className="w-5 h-5 text-blue-600" />
        <span>What You Can Do With This File</span>
      </h2>

      {/* Engine-resolved tool actions */}
      {analysis.availableTools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.availableTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.route)}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer group ${
                tool.isPrimary
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex items-center gap-2 font-bold text-sm ${
                    tool.isPrimary ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  <ActionIcon name={tool.iconName} />
                  <span>{tool.title}</span>
                </span>
                {tool.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      tool.isPrimary
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  tool.isPrimary ? 'text-blue-50' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tool.description}
              </p>
              <span
                className={`flex items-center gap-1 text-[11px] font-bold pt-1 ${
                  tool.isPrimary ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Opener matrix — real programs grouped by OS */}
      {osKeys.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Open .{detectedExt.toUpperCase()} with a program
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {osKeys.map((os) => {
              const apps = openers![os];
              return (
                <div
                  key={os}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {OPENER_OS_LABELS[os]} ({apps.length})
                  </p>
                  <ul className="space-y-1.5">
                    {apps.slice(0, 4).map((app) => (
                      <li key={app.id}>
                        <button
                          onClick={() => onNavigate({ view: 'software-detail', id: app.id })}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-left"
                        >
                          {app.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {apps.length > 4 && (
                    <p className="text-[11px] text-slate-400">+{apps.length - 4} more programs</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
