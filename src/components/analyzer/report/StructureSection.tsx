import React from 'react';
import { Layers, FileText, Film, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import type { FileAnalysis, ZipContainerKind, StructureReport } from '../../../lib/analyzer/types';
import { formatBytes } from '../../../utils/fileAnalyzer';

interface StructureSectionProps {
  structure: StructureReport;
  analysis: FileAnalysis;
}

const CONTAINER_KIND_LABEL: Record<ZipContainerKind, string> = {
  zip: 'ZIP archive',
  docx: 'Word document',
  docm: 'Macro-enabled Word document',
  xlsx: 'Excel workbook',
  xlsm: 'Macro-enabled Excel workbook',
  pptx: 'PowerPoint presentation',
  pptm: 'Macro-enabled PowerPoint presentation',
  ooxml: 'Office Open XML document',
  'ooxml-macro': 'Macro-enabled Office document',
  epub: 'EPUB ebook',
  odf: 'OpenDocument file',
  apk: 'Android app package',
  jar: 'Java archive',
};

function formatDuration(sec: number | undefined): string {
  if (sec === undefined || !Number.isFinite(sec)) return '—';
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  return `${m}:${String(rest).padStart(2, '0')}`;
}

function ZipBlock({ structure }: { structure: StructureReport }) {
  const zip = structure.zip!;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
          {CONTAINER_KIND_LABEL[zip.containerKind] ?? zip.containerKind}
        </span>
        {zip.hasMacros && (
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Contains VBA macros (vbaProject.bin)</span>
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {zip.truncated
          ? `Showing first ${zip.entries.length} of ${zip.totalEntries} entries.`
          : `${zip.totalEntries} ${zip.totalEntries === 1 ? 'entry' : 'entries'} in this container.`}
      </p>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 sticky top-0">
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="py-2 px-4 font-bold">Entry</th>
                <th className="py-2 px-4 font-bold text-right">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {zip.entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-mono text-slate-700 dark:text-slate-300 break-all">
                    {entry.isDirectory ? <span className="text-indigo-500 font-sans mr-1">▸</span> : ''}
                    {entry.name}
                  </td>
                  <td className="py-2 px-4 font-mono text-right text-slate-500 whitespace-nowrap">
                    {entry.isDirectory ? '—' : formatBytes(entry.uncompressedSize)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {zip.executableEntries.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs space-y-1.5">
          <p className="font-bold text-red-800 dark:text-red-200">
            Executable content found inside this archive ({zip.executableEntries.length}):
          </p>
          <ul className="font-mono text-red-700 dark:text-red-300 break-all space-y-0.5">
            {zip.executableEntries.slice(0, 10).map((name) => (
              <li key={name}>• {name}</li>
            ))}
          </ul>
        </div>
      )}
      {zip.riskyEntryCount > zip.executableEntries.length && (
        <p className="text-xs text-slate-500">
          {zip.riskyEntryCount} entries have executable-looking names; contents of the rest were not scanned.
        </p>
      )}
    </div>
  );
}

function PdfBlock({ structure }: { structure: StructureReport }) {
  const pdf = structure.pdf!;
  const rows: Array<[string, string | undefined]> = [
    ['Pages', pdf.pageCount !== undefined ? String(pdf.pageCount) : undefined],
    ['PDF version', pdf.pdfVersion],
    ['Encrypted', pdf.isEncrypted ? 'Yes — password protected' : 'No'],
    ['Producer', pdf.producer],
    ['Creator', pdf.creator],
    ['Author', pdf.author],
    ['Title', pdf.title],
    ['Created', pdf.creationDate],
    ['Modified', pdf.modificationDate],
    ['Embedded files', pdf.embeddedFiles !== undefined ? String(pdf.embeddedFiles) : undefined],
  ];
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {rows
          .filter(([, v]) => v !== undefined)
          .map(([label, value]) => (
            <div
              key={label}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            >
              <dt className="text-slate-400 text-[11px] font-semibold">{label}</dt>
              <dd className="font-bold text-slate-900 dark:text-white break-all">{value}</dd>
            </div>
          ))}
      </dl>
      {pdf.hasJavaScript && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
          <strong>Embedded JavaScript detected.</strong> Some PDFs use JavaScript for forms, but it is also a
          known vector for malicious documents — treat this file with care.
        </div>
      )}
    </div>
  );
}

function MediaBlock({ structure }: { structure: StructureReport }) {
  const media = structure.media!;
  const audioOnly = media.tracks.every((t) => t.type === 'audio' || t.type === 'other');
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <dt className="text-slate-400 text-[11px] font-semibold">Duration</dt>
          <dd className="font-bold text-slate-900 dark:text-white">{formatDuration(media.durationSec)}</dd>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <dt className="text-slate-400 text-[11px] font-semibold">Container</dt>
          <dd className="font-bold text-slate-900 dark:text-white">{media.majorBrand ?? '—'}</dd>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <dt className="text-slate-400 text-[11px] font-semibold">Tracks</dt>
          <dd className="font-bold text-slate-900 dark:text-white">{media.tracks.length}</dd>
        </div>
      </dl>
      {media.tracks.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="py-2 px-4 font-bold">Type</th>
                <th className="py-2 px-4 font-bold">Codec</th>
                <th className="py-2 px-4 font-bold">Dimensions</th>
                <th className="py-2 px-4 font-bold">Language</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {media.tracks.map((track, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-4 font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {track.type}
                  </td>
                  <td className="py-2 px-4 font-mono text-slate-600 dark:text-slate-300">{track.codec ?? '—'}</td>
                  <td className="py-2 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {track.width && track.height ? `${track.width} × ${track.height}` : '—'}
                  </td>
                  <td className="py-2 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {track.language ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!media.moovParsed && (
        <p className="text-xs text-slate-500">
          The metadata box sat outside the sampled bytes, so duration and track data may be incomplete —
          the file was not fully read.
        </p>
      )}
      {audioOnly && (
        <p className="text-xs text-slate-500">Audio-only file — no video track present.</p>
      )}
    </div>
  );
}

function ImageFacts({ analysis }: { analysis: FileAnalysis }) {
  const img = analysis.metadata.image;
  if (!img || (img.width === undefined && img.height === undefined)) return null;
  const camera = [img.cameraMake, img.cameraModel].filter(Boolean).join(' ');
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <dt className="text-slate-400 text-[11px] font-semibold">Dimensions</dt>
        <dd className="font-bold text-slate-900 dark:text-white">
          {img.width} × {img.height}
          {img.megapixels ? ` (${img.megapixels})` : ''}
        </dd>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <dt className="text-slate-400 text-[11px] font-semibold">Camera</dt>
        <dd className="font-bold text-slate-900 dark:text-white">{camera || 'Not recorded'}</dd>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <dt className="text-slate-400 text-[11px] font-semibold">Color / depth</dt>
        <dd className="font-bold text-slate-900 dark:text-white">
          {[img.colorSpace, img.bitDepth].filter(Boolean).join(' · ') || 'Not recorded'}
        </dd>
      </div>
    </div>
  );
}

export const StructureSection: React.FC<StructureSectionProps> = ({ structure, analysis }) => (
  <section
    id="structure"
    className="scroll-mt-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
      <Layers className="w-5 h-5 text-indigo-600" />
      <span>Inside This File</span>
    </h2>

    {!structure.available ? (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>{structure.reason ?? 'Structure analysis is not available for this format.'}</span>
      </div>
    ) : (
      <>
        {structure.family === 'zip' && structure.zip && <ZipBlock structure={structure} />}
        {structure.family === 'pdf' && structure.pdf && <PdfBlock structure={structure} />}
        {structure.family === 'media' && structure.media && <MediaBlock structure={structure} />}
        {structure.family === 'unsupported' && <ImageFacts analysis={analysis} />}
        {structure.family === 'archive_limited' && <ImageFacts analysis={analysis} />}
      </>
    )}

    {structure.notes.length > 0 && (
      <ul className="text-xs text-slate-500 space-y-1 pt-1">
        {structure.notes.map((note, idx) => (
          <li key={idx} className="flex items-start gap-1.5">
            <span className="mt-1">•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    )}
  </section>
);

// Re-exported for the section header icon mapping in tests/docs.
export { Film, ImageIcon };
