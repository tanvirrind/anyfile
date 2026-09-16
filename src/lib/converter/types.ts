import { AppRoute } from '../../types';

export type FileCategory =
  | 'Image'
  | 'Document'
  | 'Audio'
  | 'Video'
  | 'Archive'
  | 'Vector'
  | 'CAD'
  | 'Font'
  | 'Ebook'
  | 'Presentation'
  | 'Spreadsheet';

export interface FormatInfo {
  ext: string; // e.g. "heic"
  name: string; // e.g. "High Efficiency Image Container"
  category: FileCategory;
  mimeTypes: string[];
  description: string;
  magicBytesHex?: string;
  commonUses: string[];
  developer?: string;
}

export interface ConverterPair {
  id: string; // e.g. "heic-to-jpg"
  fromExt: string; // "heic"
  toExt: string; // "jpg"
  name: string; // "HEIC to JPG Converter"
  category: FileCategory;
  description: string;
  isPopular?: boolean;
  badge?: string;
  features: string[];
  steps: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  fromFormat: FormatInfo;
  toFormat: FormatInfo;
}

export type QueueStatus = 'pending' | 'queued' | 'converting' | 'completed' | 'error' | 'cancelled';

export interface QueueItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  fromExt: string;
  toExt: string;
  status: QueueStatus;
  progress: number;
  resultBlobUrl?: string;
  resultFileName?: string;
  resultSize?: number;
  errorMessage?: string;
  timestamp: number;
  folderPath?: string;
  retryCount?: number;
  abortController?: AbortController;
}

export interface ConversionHistoryItem {
  id: string;
  fileName: string;
  fromExt: string;
  toExt: string;
  originalSize: number;
  convertedSize: number;
  timestamp: number;
  resultBlobUrl?: string;
}

export interface ConversionOptions {
  quality?: number; // 1-100 for JPEG/WEBP
  bgFill?: string; // e.g. "#FFFFFF" for transparent PNG to JPG
  resizeWidth?: number;
  resizeHeight?: number;
}
