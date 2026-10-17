import React from 'react';
import type { AppRoute } from '../../../types';
import type { FileAnalysis } from '../../../lib/analyzer/types';
import { buildPrivacyFindings } from '../../../lib/analyzer/privacyFindings';
import { Breadcrumb } from '../../Breadcrumb';
import { FAQAccordion } from '../../FAQAccordion';
import { TOCSidebar } from '../../TOCSidebar';
import { SEOHead } from '../../SEOHead';
import { InstallPrompt } from '../../InstallPrompt';
import { VerdictHeader } from './VerdictHeader';
import { StructureSection } from './StructureSection';
import { PrivacySection } from './PrivacySection';
import { SafetySection } from './SafetySection';
import { HexSection } from './HexSection';
import { WhatIsItSection } from './WhatIsItSection';
import { ActionsSection } from './ActionsSection';

interface FileIntelligenceReportProps {
  analysis: FileAnalysis;
  onNavigate: (route: AppRoute) => void;
  activeToc: string;
  onTocSelect: (id: string) => void;
}

/**
 * Pure report composition — no data loading, no effects — so it renders
 * identically on the server and can be exercised in unit tests.
 */
export const FileIntelligenceReport: React.FC<FileIntelligenceReportProps> = ({
  analysis,
  onNavigate,
  activeToc,
  onTocSelect,
}) => {
  const privacyFindings = buildPrivacyFindings(analysis.metadata);

  const tocItems = [
    { id: 'verdict', label: 'Verdict & Summary' },
    ...(analysis.structure ? [{ id: 'structure', label: 'Inside This File' }] : []),
    { id: 'privacy', label: 'Privacy Exposure' },
    { id: 'security', label: 'Safety & Integrity' },
    { id: 'magic-bytes', label: 'Magic Bytes & Hex Stream' },
    { id: 'what-is-it', label: 'Format Description' },
    { id: 'actions', label: 'What You Can Do' },
    { id: 'faq', label: 'FAQs' },
  ];

  const faqs = [
    {
      question: `How did AnyFileX identify ${analysis.fileName}?`,
      answer: `Our intelligence engine inspected the raw binary magic header bytes and matched the hex signature against a database of 82 verified signatures, then cross-checked the file's container structure and metadata — all inside your browser.`,
    },
    {
      question: `Is ${analysis.fileName} safe to open?`,
      answer: `${analysis.security.neutralStatement} Safety verdict: ${analysis.security.badgeText}.`,
    },
    {
      question: `Was my file uploaded anywhere?`,
      answer: `No. Every byte of the analysis — identification, structure scan, hashing and metadata extraction — ran locally in your browser. The file never left your device.`,
    },
  ];

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title={`File Intelligence Report: ${analysis.fileName} (${analysis.detectedFormat})`}
        description={`Deep file intelligence for ${analysis.fileName}: detected as ${analysis.detectedFormat} with ${analysis.confidenceScore}% confidence. Safety verdict: ${analysis.security.badgeText}. Analyzed entirely in your browser.`}
        canonicalPath={`/tools/file-identifier`}
      />
      <Breadcrumb
        items={[
          { label: 'Tools', route: { view: 'tools' } },
          { label: 'File Analyzer', route: { view: 'file-identifier' } },
          { label: `Report: ${analysis.fileName}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* PWA install nudge — shown once, only after a successful analysis */}
      <InstallPrompt slot="identifier" />

      <div id="verdict" className="scroll-mt-24">
        <VerdictHeader analysis={analysis} onNavigate={onNavigate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TOCSidebar items={tocItems} activeId={activeToc} onSelect={onTocSelect} title="Report Sections" />
        </div>

        <div className="lg:col-span-3 space-y-8">
          {analysis.structure && (
            <StructureSection structure={analysis.structure} analysis={analysis} />
          )}

          <PrivacySection findings={privacyFindings} onNavigate={onNavigate} />

          <SafetySection analysis={analysis} />

          <HexSection analysis={analysis} />

          <WhatIsItSection analysis={analysis} onNavigate={onNavigate} />

          <ActionsSection analysis={analysis} onNavigate={onNavigate} />

          <section id="faq" className="scroll-mt-24">
            <FAQAccordion faqs={faqs} />
          </section>
        </div>
      </div>
    </div>
  );
};
