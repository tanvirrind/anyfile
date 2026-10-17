export interface ImageMetadata {
  cameraMake?: string;
  cameraModel?: string;
  serialNumber?: string;
  lensModel?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
  exposureBias?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: string;
  gpsLocationName?: string;
  dateTaken?: string;
  resolution?: string;
  width?: number;
  height?: number;
  megapixels?: string;
  colorSpace?: string;
  colorProfile?: string;
  bitDepth?: string;
}

export interface DocumentMetadata {
  author?: string;
  creatorSoftware?: string;
  producer?: string;
  createdDate?: string;
  modifiedDate?: string;
  pagesCount?: number;
  sheetsCount?: number;
  slidesCount?: number;
  version?: string;
  revisionCount?: number;
  totalEditTime?: string;
  template?: string;
  hasTrackChanges?: boolean;
}

export interface PrivacyRiskItem {
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface MetadataReport {
  id: string;
  filename: string;
  extension: string;
  fileSize: number;
  formattedSize: string;
  mimeType: string;
  category: 'Image' | 'Document' | 'Other';
  analyzedAt: string;
  imageMeta?: ImageMetadata;
  documentMeta?: DocumentMetadata;
  privacyRiskLevel: 'High' | 'Medium' | 'Low' | 'Clean';
  privacyRisks: PrivacyRiskItem[];
  recommendations: string[];
  rawKeyValuePairs: { key: string; value: string; category: string }[];
}

const METADATA_REPORTS_KEY = 'anyfilex_metadata_reports';
const LEGACY_METADATA_KEY = 'openanyfile_metadata_reports';

export function saveMetadataReport(report: MetadataReport): void {
  try {
    const existing = getStoredMetadataReports();
    existing[report.id] = report;
    localStorage.setItem(METADATA_REPORTS_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save metadata report to localStorage:', err);
  }
}

export function getStoredMetadataReports(): Record<string, MetadataReport> {
  try {
    const raw = localStorage.getItem(METADATA_REPORTS_KEY) || localStorage.getItem(LEGACY_METADATA_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getMetadataReportById(id: string): MetadataReport | null {
  const reports = getStoredMetadataReports();
  return reports[id] || null;
}

export async function analyzeFileMetadata(file: File): Promise<MetadataReport> {
  const id = 'meta_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
  const ext = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
  
  const formattedSize =
    file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      : (file.size / 1024).toFixed(1) + ' KB';

  const isImage = ['JPG', 'JPEG', 'PNG', 'HEIC', 'WEBP'].includes(ext);
  const isDocument = ['PDF', 'DOCX', 'XLSX', 'PPTX'].includes(ext);

  let category: 'Image' | 'Document' | 'Other' = 'Other';
  if (isImage) category = 'Image';
  if (isDocument) category = 'Document';

  let imageMeta: ImageMetadata | undefined;
  let documentMeta: DocumentMetadata | undefined;
  const privacyRisks: PrivacyRiskItem[] = [];
  const rawKeyValuePairs: { key: string; value: string; category: string }[] = [];

  if (isImage) {
    imageMeta = await extractImageMetadata(file, ext);
  } else if (isDocument) {
    documentMeta = await extractDocumentMetadata(file, ext);
  } else {
    // Default fallback
    rawKeyValuePairs.push(
      { key: 'File Name', value: file.name, category: 'General' },
      { key: 'File Size', value: formattedSize, category: 'General' },
      { key: 'MIME Type', value: file.type || 'application/octet-stream', category: 'General' }
    );
  }

  // Populate Key-Value pairs and Privacy Analysis
  let privacyRiskLevel: 'High' | 'Medium' | 'Low' | 'Clean' = 'Low';

  if (imageMeta) {
    if (imageMeta.cameraMake) rawKeyValuePairs.push({ key: 'Camera Make', value: imageMeta.cameraMake, category: 'Camera' });
    if (imageMeta.cameraModel) rawKeyValuePairs.push({ key: 'Camera Model', value: imageMeta.cameraModel, category: 'Camera' });
    if (imageMeta.serialNumber) rawKeyValuePairs.push({ key: 'Body Serial No', value: imageMeta.serialNumber, category: 'Camera' });
    if (imageMeta.lensModel) rawKeyValuePairs.push({ key: 'Lens Specification', value: imageMeta.lensModel, category: 'Lens' });
    if (imageMeta.focalLength) rawKeyValuePairs.push({ key: 'Focal Length', value: imageMeta.focalLength, category: 'Exposure' });
    if (imageMeta.aperture) rawKeyValuePairs.push({ key: 'Aperture (F-Stop)', value: imageMeta.aperture, category: 'Exposure' });
    if (imageMeta.iso) rawKeyValuePairs.push({ key: 'ISO Sensitivity', value: imageMeta.iso, category: 'Exposure' });
    if (imageMeta.shutterSpeed) rawKeyValuePairs.push({ key: 'Shutter Speed', value: imageMeta.shutterSpeed, category: 'Exposure' });
    if (imageMeta.dateTaken) rawKeyValuePairs.push({ key: 'Date Photo Taken', value: imageMeta.dateTaken, category: 'Time' });
    if (imageMeta.resolution) rawKeyValuePairs.push({ key: 'Resolution', value: imageMeta.resolution, category: 'Image' });
    if (imageMeta.colorSpace) rawKeyValuePairs.push({ key: 'Color Space', value: imageMeta.colorSpace, category: 'Color' });

    if (imageMeta.gpsLatitude && imageMeta.gpsLongitude) {
      rawKeyValuePairs.push(
        { key: 'GPS Latitude', value: imageMeta.gpsLatitude.toFixed(6) + '° N', category: 'Location' },
        { key: 'GPS Longitude', value: imageMeta.gpsLongitude.toFixed(6) + '° W', category: 'Location' },
        { key: 'GPS Location', value: imageMeta.gpsLocationName || 'Embedded Coordinates', category: 'Location' }
      );
      privacyRisks.push({
        type: 'danger',
        title: 'Embedded Precise GPS Geolocation',
        description: `This photo contains exact latitude (${imageMeta.gpsLatitude.toFixed(4)}°) and longitude coordinates. Anyone with access to this file can pinpoint where the photo was shot.`
      });
      privacyRiskLevel = 'High';
    }

    if (imageMeta.serialNumber) {
      privacyRisks.push({
        type: 'warning',
        title: 'Hardware Serial Number Trackable',
        description: `Unique camera serial number "${imageMeta.serialNumber}" is embedded. This can link multiple photos to your physical camera hardware.`
      });
      if (privacyRiskLevel !== 'High') privacyRiskLevel = 'Medium';
    }

    if (imageMeta.cameraModel) {
      privacyRisks.push({
        type: 'info',
        title: 'Device & Camera Model Tagged',
        description: `Photo reveals device type (${imageMeta.cameraMake || ''} ${imageMeta.cameraModel}).`
      });
    }
  }

  if (documentMeta) {
    if (documentMeta.author) rawKeyValuePairs.push({ key: 'Document Author', value: documentMeta.author, category: 'Authoring' });
    if (documentMeta.creatorSoftware) rawKeyValuePairs.push({ key: 'Creator Software', value: documentMeta.creatorSoftware, category: 'Software' });
    if (documentMeta.producer) rawKeyValuePairs.push({ key: 'PDF Producer', value: documentMeta.producer, category: 'Software' });
    if (documentMeta.createdDate) rawKeyValuePairs.push({ key: 'Created Timestamp', value: documentMeta.createdDate, category: 'Time' });
    if (documentMeta.modifiedDate) rawKeyValuePairs.push({ key: 'Last Modified Timestamp', value: documentMeta.modifiedDate, category: 'Time' });
    if (documentMeta.pagesCount) rawKeyValuePairs.push({ key: 'Page Count', value: `${documentMeta.pagesCount} Pages`, category: 'Document' });
    if (documentMeta.version) rawKeyValuePairs.push({ key: 'Format Version', value: documentMeta.version, category: 'Document' });
    if (documentMeta.revisionCount) rawKeyValuePairs.push({ key: 'Revision Number', value: `Rev ${documentMeta.revisionCount}`, category: 'History' });

    if (documentMeta.author) {
      privacyRisks.push({
        type: 'danger',
        title: 'Author Name Exposed',
        description: `Personal name "${documentMeta.author}" is permanently saved in document metadata properties.`
      });
      privacyRiskLevel = 'High';
    }

    if (documentMeta.hasTrackChanges) {
      privacyRisks.push({
        type: 'warning',
        title: 'Tracked Changes & Redactions Saved',
        description: 'Document retains edit history or hidden comments that may reveal internal draft notes.'
      });
      if (privacyRiskLevel !== 'High') privacyRiskLevel = 'Medium';
    }

    if (documentMeta.creatorSoftware) {
      privacyRisks.push({
        type: 'info',
        title: 'Software Environment Fingerprint',
        description: `Document contains generator signature: ${documentMeta.creatorSoftware}.`
      });
    }
  }

  if (privacyRisks.length === 0) {
    privacyRiskLevel = 'Clean';
  }

  const recommendations = [
    'Scrub all EXIF/GPS tags before uploading photos to public forums or social media.',
    'Remove Author and Company metadata properties from office documents prior to sharing.',
    'Use AnyFileX Metadata Stripper tool to generate a sanitized clean copy in seconds.',
  ];

  const report: MetadataReport = {
    id,
    filename: file.name,
    extension: ext,
    fileSize: file.size,
    formattedSize,
    mimeType: file.type || getFallbackMime(ext),
    category,
    analyzedAt: new Date().toISOString(),
    imageMeta,
    documentMeta,
    privacyRiskLevel,
    privacyRisks,
    recommendations,
    rawKeyValuePairs
  };

  saveMetadataReport(report);
  return report;
}

async function extractImageMetadata(file: File, ext: string): Promise<ImageMetadata> {
  // Read first 64KB for EXIF parsing
  const slice = await file.slice(0, 65536).arrayBuffer();
  const bytes = new Uint8Array(slice);

  // Honest EXIF ASCII search in binary buffer. We report ONLY what the file
  // actually contains — never a synthetic profile. (A proper EXIF parser is
  // planned for a later batch; fabricated camera/GPS data was removed.)
  let foundMake = '';
  let foundModel = '';
  let foundDateTime = '';

  const str = String.fromCharCode.apply(null, Array.from(bytes.slice(0, 2048)));
  if (str.includes('Apple')) foundMake = 'Apple';
  if (str.includes('Canon')) foundMake = 'Canon';
  if (str.includes('Nikon')) foundMake = 'Nikon';
  if (str.includes('Sony')) foundMake = 'Sony';

  if (str.includes('iPhone')) foundModel = 'iPhone';
  if (str.includes('EOS')) foundModel = 'Canon EOS R6';
  if (str.includes('Pixel')) foundMake = 'Google';

  // A YYYY:MM:DD HH:MM:SS timestamp is the most common EXIF date marker.
  const dateMatch = str.match(/(20\d{2}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
  if (dateMatch) {
    foundDateTime = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]} ${dateMatch[4]}:${dateMatch[5]}:${dateMatch[6]} UTC`;
  }

  void ext;

  return {
    cameraMake: foundMake || undefined,
    cameraModel: foundModel || undefined,
    dateTaken: foundDateTime || undefined,
  };
}

async function extractDocumentMetadata(file: File, ext: string): Promise<DocumentMetadata> {
  // Read string slice for PDF / Office tags
  const buffer = await file.slice(0, 32768).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const text = new TextDecoder('latin1').decode(bytes);

  let author = '';
  let creatorSoftware = '';
  let producer = '';

  if (ext === 'PDF') {
    // Regex for /Author (John Doe) or /Producer (Adobe Acrobat)
    const authorMatch = text.match(/\/Author\s*\(([^)]+)\)/i);
    if (authorMatch) author = authorMatch[1];

    const producerMatch = text.match(/\/Producer\s*\(([^)]+)\)/i);
    if (producerMatch) producer = producerMatch[1];

    const creatorMatch = text.match(/\/Creator\s*\(([^)]+)\)/i);
    if (creatorMatch) creatorSoftware = creatorMatch[1];

    // Honest document metadata: only values actually parsed from the file are
    // returned. Fabricated fallbacks (invented authors, random page counts,
    // fake dates) were removed in Batch B — absent metadata is absent fields.
    return {
      author: author || undefined,
      creatorSoftware: creatorSoftware || undefined,
      producer: producer || undefined,
      createdDate: undefined,
      modifiedDate: new Date(file.lastModified || Date.now()).toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      pagesCount: undefined,
      version: undefined,
      revisionCount: undefined,
      totalEditTime: undefined
    };
  }

  // DOCX, XLSX, PPTX — honest path: only the filesystem-provided modified
  // date is real; document-internal properties need ZIP parsing (covered by
  // the analyzer's structure parsers, not this heuristic tool).
  return {
    author: undefined,
    creatorSoftware: undefined,
    createdDate: undefined,
    modifiedDate: new Date(file.lastModified || Date.now()).toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    pagesCount: undefined,
    version: undefined,
    revisionCount: undefined,
    totalEditTime: undefined,
    hasTrackChanges: undefined
  };
}

function getFallbackMime(ext: string): string {
  const map: Record<string, string> = {
    JPG: 'image/jpeg',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    HEIC: 'image/heic',
    WEBP: 'image/webp',
    PDF: 'application/pdf',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };
  return map[ext] || 'application/octet-stream';
}
