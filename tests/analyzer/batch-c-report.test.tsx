/**
 * Batch C report-UI tests.
 * Renders the pure report components against realistic FileAnalysis fixtures
 * and asserts each section shows its data (and its honest empty states).
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { buildPrivacyFindings } from '../../src/lib/analyzer/privacyFindings';
import { VerdictHeader } from '../../src/components/analyzer/report/VerdictHeader';
import { StructureSection } from '../../src/components/analyzer/report/StructureSection';
import { PrivacySection } from '../../src/components/analyzer/report/PrivacySection';
import { SafetySection } from '../../src/components/analyzer/report/SafetySection';
import { HexSection } from '../../src/components/analyzer/report/HexSection';
import { WhatIsItSection } from '../../src/components/analyzer/report/WhatIsItSection';
import { ActionsSection } from '../../src/components/analyzer/report/ActionsSection';
import { FileIntelligenceReport } from '../../src/components/analyzer/report/FileIntelligenceReport';
import {
  docmFixture,
  jpegGpsFixture,
  mismatchFixture,
  spoofedExeFixture,
  txtFixture,
} from './batch-c-fixtures';

const noop = () => {};

describe('buildPrivacyFindings', () => {
  it('extracts GPS + device findings from real EXIF', () => {
    const findings = buildPrivacyFindings(jpegGpsFixture().metadata);
    const ids = findings.map((f) => f.id);
    expect(ids).toContain('gps');
    expect(ids).toContain('device');
    expect(ids).toContain('date-taken');
    const gps = findings.find((f) => f.id === 'gps')!;
    expect(gps.detail).toContain('37.7749');
    expect(gps.severity).toBe('caution');
  });

  it('returns no findings when metadata is empty (honest positive)', () => {
    expect(buildPrivacyFindings(txtFixture().metadata)).toEqual([]);
  });
});

describe('VerdictHeader', () => {
  it('shows the mismatch banner for a mislabeled file', () => {
    const html = renderToString(<VerdictHeader analysis={mismatchFixture()} onNavigate={noop} />);
    expect(html).toContain('Extension mismatch');
    expect(html).toContain('PNG Image');
    expect(html).toContain('report.jpg');
  });

  it('shows the spoof banner for a disguised executable', () => {
    const html = renderToString(<VerdictHeader analysis={spoofedExeFixture()} onNavigate={noop} />);
    expect(html).toContain('Extension mismatch');
    expect(html).toContain('Windows Executable');
    expect(html).toContain('invoice.pdf');
  });

  it('renders the safety verdict and top indicator reasons', () => {
    const html = renderToString(<VerdictHeader analysis={docmFixture()} onNavigate={noop} />);
    expect(html).toContain('Warning — macros detected');
    expect(html).toContain('VBA macros detected');
    expect(html).toContain('48.21 KB');
    expect(html).toContain('Confidence Match');
    expect(html).toContain('>97<!-- -->');
  });
});

describe('StructureSection', () => {
  it('lists ZIP entries, macro flag and truncation state', () => {
    const fixture = docmFixture();
    const html = renderToString(
      <StructureSection structure={fixture.structure!} analysis={fixture} />
    );
    expect(html).toContain('Macro-enabled Word document');
    expect(html).toContain('vbaProject.bin');
    expect(html).toContain('Contains VBA macros');
    expect(html).toContain('3 entries in this container');
  });

  it('shows the honest reason when structure is unavailable', () => {
    const fixture = txtFixture();
    const html = renderToString(
      <StructureSection structure={fixture.structure!} analysis={fixture} />
    );
    expect(html).toContain('Plain text files have no container structure to inspect.');
  });
});

describe('PrivacySection', () => {
  it('surfaces GPS with a plain-language note', () => {
    const fixture = jpegGpsFixture();
    const html = renderToString(
      <PrivacySection findings={buildPrivacyFindings(fixture.metadata)} onNavigate={noop} />
    );
    expect(html).toContain('Precise GPS coordinates');
    expect(html).toContain('37.7749, -122.4194');
    expect(html).toContain('exact location where the photo was taken');
    expect(html).toContain('Strip This Metadata');
  });

  it('shows the positive empty state when nothing was found', () => {
    const html = renderToString(<PrivacySection findings={[]} onNavigate={noop} />);
    expect(html).toContain('No location or device data found');
    expect(html).not.toContain('Strip This Metadata');
  });
});

describe('SafetySection', () => {
  it('lists every indicator with its reason and explains entropy', () => {
    const fixture = docmFixture();
    const html = renderToString(<SafetySection analysis={fixture} />);
    expect(html).toContain('VBA macros detected');
    expect(html).toContain('Macros can run code automatically');
    expect(html).toContain('7.82');
    expect(html).toContain('Entropy measures how random');
    expect(html).toContain('md5abc');
  });

  it('handles a file with no indicators honestly', () => {
    const html = renderToString(<SafetySection analysis={txtFixture()} />);
    expect(html).toContain('No security signals were raised');
  });
});

describe('HexSection + WhatIsItSection', () => {
  it('renders the hex table and meaning line', () => {
    const fixture = docmFixture();
    const html = renderToString(<HexSection analysis={fixture} />);
    expect(html).toContain('0x00000000');
    expect(html).toContain('OOXML container');
    expect(html).toContain('50 4B 03 04');
  });

  it('links to the format guide', () => {
    const fixture = docmFixture();
    const html = renderToString(<WhatIsItSection analysis={fixture} onNavigate={noop} />);
    expect(html).toContain('Word Macro-Enabled Document');
    expect(html).toContain('format guide');
  });
});

describe('ActionsSection', () => {
  it('renders engine-resolved tool actions and the opener matrix', () => {
    const html = renderToString(<ActionsSection analysis={mismatchFixture()} onNavigate={noop} />);
    // no availableTools on this fixture; openers for png must exist
    expect(html).toContain('with a program');
    expect(html).toContain('Windows');
  });

  it('renders tool action cards from availableTools', () => {
    const html = renderToString(<ActionsSection analysis={docmFixture()} onNavigate={noop} />);
    expect(html).toContain('How to Open .DOCM Files');
  });
});

describe('FileIntelligenceReport (full composition)', () => {
  const toc = { activeToc: 'verdict', onTocSelect: noop };

  /** Breadcrumb needs the next-intl provider the app's layout supplies. */
  const compose = (analysis: Parameters<typeof FileIntelligenceReport>[0]['analysis']) =>
    renderToString(
      <NextIntlClientProvider locale="en" messages={{}}>
        <FileIntelligenceReport analysis={analysis} onNavigate={noop} {...toc} />
      </NextIntlClientProvider>
    );

  it('composes every section for a rich report', () => {
    const html = compose(jpegGpsFixture());
    expect(html).toContain('Report: photo.jpg');
    expect(html).toContain('File Intelligence Report');
    expect(html).toContain('Precise GPS coordinates');
    expect(html).toContain('Inside This File');
    expect(html).toContain('Privacy Exposure');
    expect(html).toContain('Safety &amp; Integrity');
    expect(html).toContain('Magic Bytes');
    expect(html).toContain('What You Can Do With This File');
  });

  it('omits the structure section when no structure data exists', () => {
    const html = compose(spoofedExeFixture());
    expect(html).not.toContain('Inside This File');
    expect(html).toContain('Executable disguised as a document');
  });

  it('keeps the install-prompt mount and breadcrumb intact', () => {
    const html = compose(txtFixture());
    expect(html).toContain('Report: notes.txt');
  });
});
