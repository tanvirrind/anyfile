import React, { useState, useEffect } from 'react';
import { Binary, SearchX } from 'lucide-react';
import { getStoredAnalysis } from '../lib/analyzer/fileAnalyzerService';
import type { FileAnalysis } from '../lib/analyzer/types';
import { AppRoute } from '../types';
import { FileIntelligenceReport } from '../components/analyzer/report/FileIntelligenceReport';
import { SmartLink } from '../components/SmartLink';

interface FileIdentifierResultPageProps {
  reportId: string;
  onNavigate: (route: AppRoute) => void;
}

export const AnalysisNotFound: React.FC<{ onNavigate: (route: AppRoute) => void }> = ({
  onNavigate,
}) => (
  <div className="py-16 text-center space-y-4 max-w-lg mx-auto px-4">
    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
      <SearchX className="w-6 h-6" />
    </div>
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">No analysis found</h2>
    <p className="text-sm text-slate-500 leading-relaxed">
      Analysis reports live only in this browser session — if you refreshed the page or opened this
      link elsewhere, the report is gone. Your file was never uploaded anywhere.
    </p>
    <SmartLink
      route={{ view: 'file-identifier' }}
      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors cursor-pointer"
    >      Analyze a File
    </SmartLink>
  </div>
);

/**
 * URL (/tools/file-identifier), registry slug and routes are unchanged —
 * only the presentation became the File Intelligence Report.
 */
export const FileIdentifierResultPage: React.FC<FileIdentifierResultPageProps> = ({
  reportId,
  onNavigate,
}) => {
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeToc, setActiveToc] = useState('verdict');

  useEffect(() => {
    setAnalysis(getStoredAnalysis(reportId));
    setLoaded(true);
  }, [reportId]);

  if (!loaded) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
          <Binary className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Loading Analysis Report...</h2>
      </div>
    );
  }

  if (!analysis) {
    return <AnalysisNotFound onNavigate={onNavigate} />;
  }

  const handleTocSelect = (id: string) => {
    setActiveToc(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -85;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <FileIntelligenceReport
      analysis={analysis}
      onNavigate={onNavigate}
      activeToc={activeToc}
      onTocSelect={handleTocSelect}
    />
  );
};
