import type { FileMetadataExtraction } from './types';

export interface PrivacyFinding {
  id: string;
  label: string;
  detail: string;
  plainNote: string;
  severity: 'info' | 'caution';
}

/**
 * Derives human-readable privacy-exposure findings from real extracted
 * metadata. Absent tags produce no findings — never invented.
 */
export function buildPrivacyFindings(
  metadata: FileMetadataExtraction | undefined | null
): PrivacyFinding[] {
  if (!metadata) return [];
  const findings: PrivacyFinding[] = [];
  const img = metadata.image;

  if (img?.gpsLatitude !== undefined && img?.gpsLongitude !== undefined) {
    findings.push({
      id: 'gps',
      label: 'Precise GPS coordinates',
      detail: `${img.gpsLatitude}, ${img.gpsLongitude}`,
      plainNote:
        'This reveals the exact location where the photo was taken. Anyone you share this file with can see it on a map.',
      severity: 'caution',
    });
  }

  const device = [img?.cameraMake, img?.cameraModel].filter(Boolean).join(' ');
  if (device) {
    findings.push({
      id: 'device',
      label: 'Capture device',
      detail: device,
      plainNote:
        'The file names the device that created it. Device tags can identify you across files you share.',
      severity: 'info',
    });
  }

  if (img?.dateTaken) {
    findings.push({
      id: 'date-taken',
      label: 'Capture date and time',
      detail: img.dateTaken,
      plainNote: 'Timestamps reveal when — and combined with GPS, the pattern of where — you were.',
      severity: 'info',
    });
  }

  const doc = metadata.document;
  if (doc?.author) {
    findings.push({
      id: 'author',
      label: 'Author name',
      detail: doc.author,
      plainNote: 'The document carries a personal name. Consider whether recipients need to see it.',
      severity: 'info',
    });
  }

  const software = [doc?.creatorSoftware, doc?.producer].filter(Boolean).join(' · ');
  if (software) {
    findings.push({
      id: 'creator-software',
      label: 'Creator software',
      detail: software,
      plainNote: 'Software tags reveal which app — and sometimes its version — created the file.',
      severity: 'info',
    });
  }

  // Catch any remaining software/author style tags in the general bucket.
  const seen = new Set(findings.map((f) => f.id));
  for (const [key, value] of Object.entries(metadata.general ?? {})) {
    const lower = key.toLowerCase();
    const isSoftware = lower.includes('software') && !lower.includes('creator');
    if (!isSoftware || typeof value !== 'string' || !value.trim()) continue;
    if (!seen.has('general-software')) {
      findings.push({
        id: 'general-software',
        label: 'Software tag',
        detail: value.trim(),
        plainNote: 'This tag reveals which app touched the file.',
        severity: 'info',
      });
      seen.add('general-software');
    }
  }

  return findings;
}
