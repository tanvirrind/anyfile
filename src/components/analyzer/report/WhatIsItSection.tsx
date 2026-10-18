import React from 'react';
import { FileCode, ExternalLink } from 'lucide-react';
import type { AppRoute } from '../../../types';
import type { FileAnalysis } from '../../../lib/analyzer/types';
import { SmartLink, DeadLink } from '../../SmartLink';
import { isValidCatalogExtension } from '../../../lib/routes/routeManifest';

interface WhatIsItSectionProps {
  analysis: FileAnalysis;
  onNavigate: (route: AppRoute) => void;
}

export const WhatIsItSection: React.FC<WhatIsItSectionProps> = ({ analysis, onNavigate }) => {
  const detectedExt = (analysis.detectedExtension || analysis.fileNameExtension || '').toLowerCase();
  const description =
    analysis.knowledgeNode?.description ||
    `This file was identified as ${analysis.detectedFormat}. It belongs to the ${analysis.category} category.`;

  return (
    <section
      id="what-is-it"
      className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <FileCode className="w-5 h-5 text-indigo-600" />
        <span>What is this file? ({analysis.detectedFormat})</span>
      </h2>

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
        <h4 className="font-bold text-slate-900 dark:text-white">Format Specifications:</h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
          <li>
            • <strong>Format Extension:</strong> .{detectedExt.toUpperCase()}
          </li>
          <li>
            • <strong>Category Group:</strong> {analysis.category}
          </li>
          <li>
            • <strong>MIME Header:</strong> {analysis.detectedMimeType}
          </li>
          <li>
            • <strong>Magic Signature:</strong> {analysis.signature.hexSignature || '—'}
          </li>
        </ul>
      </div>

      {detectedExt && detectedExt !== 'unknown' && (
        isValidCatalogExtension(detectedExt) ? (
        <SmartLink
          route={{ view: 'extension-detail', ext: detectedExt }}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >          <span>View the full .{detectedExt.toUpperCase()} format guide</span>
          <ExternalLink className="w-4 h-4" />
        </SmartLink>
        ) : (
        <DeadLink
          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >          <span>View the full .{detectedExt.toUpperCase()} format guide</span>
          <ExternalLink className="w-4 h-4" />
        </DeadLink>
        )
      )}
    </section>
  );
};
