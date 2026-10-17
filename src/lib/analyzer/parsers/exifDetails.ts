import type { ImageMetadataInfo } from '../types';

/**
 * Real EXIF extraction via exifreader (Batch B).
 *
 * Replaces the interim ASCII substring scan in metadataExtractor. Dynamically
 * imported — non-image files pay zero bundle cost.
 *
 * Honesty rules:
 * - Only the first EXIF_SCAN_BYTES are read (EXIF lives in file headers:
 *   JPEG APP1, HEIC meta box, PNG text chunks, TIFF IFD0). Absent tags are
 *   absent fields — nothing is defaulted or invented.
 * - GPS is computed from rational components only when latitude AND
 *   longitude both parse; a lone ref or partial array yields nothing.
 */

export const EXIF_SCAN_BYTES = 1 * 1024 * 1024; // 1 MB header sample

export interface ExifDetails {
  fields: Partial<ImageMetadataInfo>;
  properties: { key: string; value: string; category: string }[];
}

function tagText(tags: Record<string, unknown>, name: string): string | undefined {
  const tag = tags[name] as { description?: unknown; value?: unknown } | undefined;
  if (!tag) return undefined;
  if (typeof tag.description === 'string' && tag.description.trim().length > 0) return tag.description.trim();
  if (typeof tag.value === 'string' && tag.value.trim().length > 0) return tag.value.trim();
  return undefined;
}

function rationalToNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  if (Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number') {
    return v[1] === 0 ? NaN : v[0] / v[1];
  }
  return NaN;
}

/** Converts exifreader GPS rational arrays ([[d,1],[m,1],[s,1]]) + ref to decimal degrees. */
function gpsDecimal(
  coord: unknown,
  ref: unknown
): number | undefined {
  if (!Array.isArray(coord) || coord.length < 3) return undefined;
  const d = rationalToNumber(coord[0]);
  const m = rationalToNumber(coord[1]);
  const s = rationalToNumber(coord[2]);
  if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(s)) return undefined;
  let decimal = Math.abs(d) + m / 60 + s / 3600;
  const refStr = Array.isArray(ref) ? String(ref[0]).toUpperCase() : String(ref || '').toUpperCase();
  if (refStr === 'S' || refStr === 'W') decimal = -decimal;
  if (!Number.isFinite(decimal)) return undefined;
  return Math.round(decimal * 1e7) / 1e7;
}

export async function extractExifDetails(file: File): Promise<ExifDetails> {
  const fields: Partial<ImageMetadataInfo> = {};
  const properties: { key: string; value: string; category: string }[] = [];

  if (file.size < 16) return { fields, properties };

  const sliceLen = Math.min(file.size, EXIF_SCAN_BYTES);
  let tags: Record<string, unknown>;
  try {
    const { default: ExifReader } = await import('exifreader');
    tags = ExifReader.load(await file.slice(0, sliceLen).arrayBuffer(), { expanded: false }) as Record<string, unknown>;
  } catch {
    return { fields, properties };
  }
  if (!tags || typeof tags !== 'object') return { fields, properties };

  const set = (key: string, value: string | undefined) => {
    if (value) properties.push({ key, value, category: 'EXIF' });
  };

  const make = tagText(tags, 'Make');
  const model = tagText(tags, 'Model');
  const lens = tagText(tags, 'LensModel');
  const dateTaken = tagText(tags, 'DateTimeOriginal') || tagText(tags, 'CreateDate') || tagText(tags, 'DateTime');
  const iso = tagText(tags, 'ISOSpeedRatings') || tagText(tags, 'ISO');
  const shutter = tagText(tags, 'ExposureTime');
  const aperture = tagText(tags, 'FNumber');
  const focal = tagText(tags, 'FocalLength');
  const software = tagText(tags, 'Software');

  if (make) fields.cameraMake = make;
  if (model) fields.cameraModel = model;
  if (lens) fields.lensModel = lens;
  if (dateTaken) fields.dateTaken = dateTaken;
  if (iso) fields.iso = iso;
  if (shutter) fields.shutterSpeed = shutter;
  if (aperture) fields.aperture = aperture;
  if (focal) fields.focalLength = focal;

  set('Camera Make', make);
  set('Camera Model', model);
  set('Lens', lens);
  set('Date Taken', dateTaken);
  set('ISO', iso);
  set('Shutter Speed', shutter);
  set('Aperture', aperture);
  set('Focal Length', focal);
  set('Software', software);

  const latTag = tags['GPSLatitude'] as { value?: unknown } | undefined;
  const lngTag = tags['GPSLongitude'] as { value?: unknown } | undefined;
  const latRefTag = tags['GPSLatitudeRef'] as { value?: unknown } | undefined;
  const lngRefTag = tags['GPSLongitudeRef'] as { value?: unknown } | undefined;
  const lat = latTag ? gpsDecimal(latTag.value, latRefTag?.value) : undefined;
  const lng = lngTag ? gpsDecimal(lngTag.value, lngRefTag?.value) : undefined;
  if (lat !== undefined && lng !== undefined) {
    fields.gpsLatitude = lat;
    fields.gpsLongitude = lng;
    properties.push({ key: 'GPS Coordinates', value: `${lat}, ${lng}`, category: 'EXIF' });
  }

  return { fields, properties };
}
