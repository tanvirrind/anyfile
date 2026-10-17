import React, { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';
import type { FileAnalysis } from '../../../lib/analyzer/types';

interface HexSectionProps {
  analysis: FileAnalysis;
}

export const HexSection: React.FC<HexSectionProps> = ({ analysis }) => {
  const [copiedHex, setCopiedHex] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(analysis.signature.hexSignature);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  return (
    <section
      id="magic-bytes"
      className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-blue-600" />
          <span>Magic Bytes & Hexadecimal Header Stream</span>
        </h2>
        <button
          onClick={copyHex}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
          title="Copy Hex Header"
        >
          {copiedHex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline font-medium">{copiedHex ? 'Copied' : 'Copy Hex'}</span>
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        The raw hexadecimal byte sequence extracted from the file header — this is what the detection
        engine matched against its signature database:
      </p>

      {analysis.signature.meaning && (
        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
          {analysis.signature.meaning}
        </p>
      )}

      <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider">
              <th className="py-2 pr-4 font-bold">Offset</th>
              <th className="py-2 px-2 font-bold">Hexadecimal Bytes (16-Byte Rows)</th>
              <th className="py-2 pl-4 font-bold text-right">ASCII String</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {analysis.signature.hexOffsetRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60">
                <td className="py-2.5 pr-4 text-blue-400 font-bold">{row.offsetHex}</td>
                <td className="py-2.5 px-2 font-bold text-emerald-400 tracking-wider">
                  {row.hexBytes.join(' ')}
                </td>
                <td className="py-2.5 pl-4 text-right text-slate-400 font-bold">{row.asciiChars}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
