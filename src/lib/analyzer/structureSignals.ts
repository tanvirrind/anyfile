import type { FileAnalysis, SecurityIndicatorItem } from './types';

/**
 * Applies structure-parser findings to the security assessment and metadata
 * (Batch B).
 *
 * The parsers produce raw structural facts; this module converts them into
 * indicators WITH reasons (never bare flags) and fills authoritative metadata
 * fields. Everything it appends is traceable to an observed fact:
 *   - vbaProject.bin present        → macro indicator (caution)
 *   - entry headers matching MZ/ELF → embedded-executable indicator (warning)
 *   - PDF /JavaScript name object   → JavaScript indicator (caution)
 *   - GPS tags in EXIF              → privacy indicator (caution)
 *   - camera/device/software tags   → privacy/device indicators (caution/info)
 *
 * Neutral, factual language per the existing security engine conventions.
 */

const STATUS_ORDER = { safe: 0, unknown: 0, caution: 1, warning: 2 } as const;

type Status = FileAnalysis['security']['status'];

function escalateTo(analysis: FileAnalysis, level: Exclude<Status, 'unknown'>): void {
  const s = analysis.security;
  if (STATUS_ORDER[level] > STATUS_ORDER[s.status]) {
    s.status = level;
    if (level === 'warning' && s.badgeText === 'Standard Format Alignment') {
      s.badgeText = 'Security Signals Detected';
    } else if (level === 'caution' && s.badgeText === 'Standard Format Alignment') {
      s.badgeText = 'Review Advised';
    }
    s.neutralStatement =
      'File header inspection detected structural or extension discrepancies. The analyzer is not an antivirus software; it inspects file structure and header integrity.';
  }
}

function pushIndicator(analysis: FileAnalysis, item: SecurityIndicatorItem): void {
  const existing = analysis.security.indicators;
  if (!existing.some((i) => i.id === item.id)) existing.push(item);
}

function addProp(analysis: FileAnalysis, key: string, value: string, category: string): void {
  const list = analysis.metadata.rawPropertyList;
  if (!list.some((p) => p.key === key)) list.push({ key, value, category });
}

function removeProps(analysis: FileAnalysis, keys: string[]): void {
  analysis.metadata.rawPropertyList = analysis.metadata.rawPropertyList.filter((p) => !keys.includes(p.key));
}

function containerKindLabel(kind: string): string {
  const labels: Record<string, string> = {
    zip: 'ZIP archive', docx: 'Office Open XML (Word)', docm: 'Office Open XML macro-enabled (Word)',
    xlsx: 'Office Open XML (Excel)', xlsm: 'Office Open XML macro-enabled (Excel)',
    pptx: 'Office Open XML (PowerPoint)', pptm: 'Office Open XML macro-enabled (PowerPoint)',
    ooxml: 'Office Open XML package', 'ooxml-macro': 'Office Open XML macro-enabled package',
    epub: 'EPUB e-book', odf: 'OpenDocument package', apk: 'Android package (APK)', jar: 'Java archive (JAR)',
  };
  return labels[kind] || 'ZIP container';
}

export function applyStructureFindings(analysis: FileAnalysis): void {
  const st = analysis.structure;
  if (!st || !st.available) return;

  // ── ZIP family ──────────────────────────────────────────────────────────
  if (st.zip) {
    const z = st.zip;
    const archive = (analysis.metadata.archive = analysis.metadata.archive || {});

    // Replace the extractor's header-scan estimates with exact listing facts.
    removeProps(analysis, ['Internal Entries Found', 'Sample Contents']);
    archive.archiveType = containerKindLabel(z.containerKind);
    archive.estimatedEntries = z.totalEntries;
    archive.sampleEntries = z.entries.slice(0, 8).map((e) => e.name);
    addProp(analysis, 'Container Type', archive.archiveType, 'Archive');
    addProp(analysis, 'Total Entries (exact)', `${z.totalEntries.toLocaleString()} files${z.truncated ? ` — list capped at ${z.entries.length}` : ''}`, 'Archive');
    if (z.entries.length > 0) {
      addProp(analysis, 'Sample Contents', z.entries.slice(0, 3).map((e) => e.name).join(', '), 'Archive');
    }

    if (z.hasMacros) {
      analysis.security.isMacroEnabled = true;
      pushIndicator(analysis, {
        id: 'struct_macro',
        type: 'caution',
        title: 'VBA Macro Project Embedded',
        description:
          'The archive contains a vbaProject.bin stream — an embedded VBA macro project. Macros execute code when the document opens in a desktop office application; enable them only for files from trusted sources.',
      });
      escalateTo(analysis, 'caution');
    }

    if (z.executableEntries.length > 0) {
      const shown = z.executableEntries.slice(0, 5).join(', ');
      pushIndicator(analysis, {
        id: 'struct_embedded_exe',
        type: 'warning',
        title: `Embedded Executable File${z.executableEntries.length > 1 ? 's' : ''} in Archive`,
        description:
          `${z.executableEntries.length} archived entr${z.executableEntries.length > 1 ? 'ies carry' : 'y carries'} an executable binary header (MZ/ELF): ${shown}${z.executableEntries.length > 5 ? ', and more' : ''}. ` +
          'Archives can hide executables behind innocent-looking names — do not extract or run these without verification.',
      });
      escalateTo(analysis, 'warning');
    }
  }

  // ── PDF ─────────────────────────────────────────────────────────────────
  if (st.pdf) {
    const p = st.pdf;
    const doc = (analysis.metadata.document = analysis.metadata.document || {});
    if (p.pageCount !== undefined) {
      doc.pageCount = p.pageCount;
      addProp(analysis, 'Page Count', `${p.pageCount.toLocaleString()} pages`, 'Document');
    }
    if (p.pdfVersion) { doc.pdfVersion = p.pdfVersion; addProp(analysis, 'PDF Version', p.pdfVersion, 'Document'); }
    if (p.producer) { doc.producer = p.producer; addProp(analysis, 'Producer', p.producer, 'Document'); }
    if (p.creator) { doc.creatorSoftware = p.creator; addProp(analysis, 'Creator', p.creator, 'Document'); }
    if (p.author) { doc.author = p.author; addProp(analysis, 'Author', p.author, 'Document'); }
    if (p.title) { doc.title = p.title; addProp(analysis, 'Title', p.title, 'Document'); }
    if (p.creationDate) { doc.createdDate = p.creationDate; addProp(analysis, 'Creation Date', p.creationDate, 'Document'); }
    if (p.modificationDate) { doc.modifiedDate = p.modificationDate; addProp(analysis, 'Modification Date', p.modificationDate, 'Document'); }
    if (p.embeddedFiles !== undefined) {
      addProp(analysis, 'Embedded Files', `${p.embeddedFiles} embedded file${p.embeddedFiles === 1 ? '' : 's'}`, 'Document');
      pushIndicator(analysis, {
        id: 'struct_pdf_embedded',
        type: 'caution',
        title: `Embedded File${p.embeddedFiles === 1 ? '' : 's'} in PDF`,
        description:
          `The PDF carries ${p.embeddedFiles} embedded file${p.embeddedFiles === 1 ? '' : 's'}. Embedded attachments are a known malware delivery vector in PDFs from untrusted sources.`,
      });
      escalateTo(analysis, 'caution');
    }

    if (p.hasJavaScript) {
      pushIndicator(analysis, {
        id: 'struct_pdf_js',
        type: 'caution',
        title: 'PDF Contains JavaScript',
        description:
          'A JavaScript name object was found in the document (heuristic scan of the file head). JavaScript is used by legitimate interactive forms, but it is also a common vector in malicious PDFs — open with a sandboxed reader.',
      });
      escalateTo(analysis, 'caution');
    }
  }

  // ── Media ───────────────────────────────────────────────────────────────
  if (st.media) {
    const m = st.media;
    const isAudioOnly = !m.tracks.some((t) => t.type === 'video');
    if (isAudioOnly) {
      const audio = (analysis.metadata.audio = analysis.metadata.audio || {});
      const audioTrack = m.tracks.find((t) => t.type === 'audio');
      if (m.durationSec !== undefined) {
        audio.durationSec = m.durationSec;
        audio.formattedDuration = formatDuration(m.durationSec);
        addProp(analysis, 'Duration', audio.formattedDuration, 'Audio');
      }
      if (audioTrack?.codec) { audio.codec = audioTrack.codec; addProp(analysis, 'Audio Codec', audioTrack.codec, 'Audio'); }
      if (m.majorBrand) addProp(analysis, 'Container Brand', m.majorBrand, 'Audio');
    } else {
      const video = (analysis.metadata.video = analysis.metadata.video || {});
      const videoTrack = m.tracks.find((t) => t.type === 'video');
      if (m.durationSec !== undefined) {
        video.durationSec = m.durationSec;
        video.formattedDuration = formatDuration(m.durationSec);
        addProp(analysis, 'Duration', video.formattedDuration, 'Video');
      }
      if (videoTrack?.width && videoTrack?.height) {
        video.width = videoTrack.width;
        video.height = videoTrack.height;
        video.aspectRatio = `${videoTrack.width}×${videoTrack.height}`;
        addProp(analysis, 'Resolution', `${videoTrack.width} × ${videoTrack.height} px`, 'Video');
      }
      if (videoTrack?.codec) { video.codec = videoTrack.codec; addProp(analysis, 'Video Codec', videoTrack.codec, 'Video'); }
      if (m.hasAudio !== undefined) {
        video.hasAudio = m.hasAudio;
        addProp(analysis, 'Audio Track', m.hasAudio ? 'Present' : 'None', 'Video');
      }
      if (m.majorBrand) addProp(analysis, 'Container Brand', m.majorBrand, 'Video');
    }
    const trackSummary = m.tracks.length > 0
      ? `${m.tracks.length} track${m.tracks.length === 1 ? '' : 's'} (${m.tracks.map((t) => `${t.type}${t.codec ? ':' + t.codec : ''}`).join(', ')})`
      : 'no tracks parsed';
    addProp(analysis, 'Media Tracks', trackSummary, isAudioOnly ? 'Audio' : 'Video');
  }

  // ── Privacy exposure (EXIF + document metadata) ─────────────────────────
  const img = analysis.metadata.image;
  if (img?.gpsLatitude !== undefined && img?.gpsLongitude !== undefined) {
    pushIndicator(analysis, {
      id: 'privacy_gps',
      type: 'caution',
      title: 'Embedded GPS Coordinates',
      description:
        `Precise location data (${img.gpsLatitude}, ${img.gpsLongitude}) is embedded in this file's metadata. ` +
        'Sharing the file reveals where it was captured — consider removing metadata before publishing.',
    });
    escalateTo(analysis, 'caution');
  }
  if (img?.cameraMake || img?.cameraModel) {
    const device = [img.cameraMake, img.cameraModel].filter(Boolean).join(' ');
    pushIndicator(analysis, {
      id: 'privacy_device',
      type: 'info',
      title: 'Device Identifier in Metadata',
      description: `The capture device is recorded as "${device}". Device tags can fingerprint the photographer across files.`,
    });
  }
  const docMeta = analysis.metadata.document;
  if (docMeta?.author || docMeta?.creatorSoftware || docMeta?.producer) {
    const who = [docMeta.author, docMeta.creatorSoftware, docMeta.producer].filter(Boolean).join(' · ');
    pushIndicator(analysis, {
      id: 'privacy_doc_meta',
      type: 'info',
      title: 'Authoring Metadata Present',
      description: `The document records authoring information: ${who}. This can reveal identities or toolchains when shared.`,
    });
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
