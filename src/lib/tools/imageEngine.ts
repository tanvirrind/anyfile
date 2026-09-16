export interface ImageProcessingMetrics {
  originalSizeBytes: number;
  outputSizeBytes: number;
  savedBytes: number;
  savedPercent: number;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
}

export interface CompressImageOptions {
  quality: number; // 0.1 to 1.0
  outputFormat: 'original' | 'jpg' | 'png' | 'webp';
  maxWidth?: number;
  maxHeight?: number;
}

export interface ResizeImageOptions {
  width?: number;
  height?: number;
  scalePercent?: number;
  maintainAspectRatio: boolean;
  mode: 'contain' | 'cover' | 'exact';
  outputFormat: 'jpg' | 'png' | 'webp';
  quality: number; // 0.1 to 1.0
}

export interface ProcessedImageResult {
  file: File;
  outputBlob: Blob;
  outputBlobUrl: string;
  outputFileName: string;
  metrics: ImageProcessingMetrics;
}

/**
 * Loads an image file (supporting HEIC, SVG, standard rasters) into an HTMLImageElement
 */
export async function loadImageElement(file: File): Promise<{ img: HTMLImageElement; width: number; height: number }> {
  let sourceBlob: Blob = file;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'heic' || ext === 'heif') {
    try {
      const heic2anyModule: any = await import('heic2any');
      const heic2any = heic2anyModule.default || heic2anyModule;
      const conversionResult = await (heic2any as any)({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.95
      });
      sourceBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    } catch (err) {
      console.warn('HEIC decode fallback failed:', err);
    }
  }

  const url = URL.createObjectURL(sourceBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({ img, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image '${file.name}'. The file format may be corrupted or unsupported.`));
    };
    img.src = url;
  });
}

/**
 * Formats bytes to human-readable string (e.g. 4.2 MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Compresses an image file in browser RAM
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions
): Promise<ProcessedImageResult> {
  const { img, width: origW, height: origH } = await loadImageElement(file);

  let targetW = origW;
  let targetH = origH;

  if (options.maxWidth && targetW > options.maxWidth) {
    const ratio = options.maxWidth / targetW;
    targetW = Math.round(targetW * ratio);
    targetH = Math.round(targetH * ratio);
  }

  if (options.maxHeight && targetH > options.maxHeight) {
    const ratio = options.maxHeight / targetH;
    targetH = Math.round(targetH * ratio);
    targetW = Math.round(targetW * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('HTML5 Canvas 2D context could not be initialized.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Determine output MIME type
  let mimeType = 'image/jpeg';
  let outExt = 'jpg';

  const origExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  if (options.outputFormat === 'original') {
    if (origExt === 'png') {
      mimeType = 'image/png';
      outExt = 'png';
    } else if (origExt === 'webp') {
      mimeType = 'image/webp';
      outExt = 'webp';
    } else {
      mimeType = 'image/jpeg';
      outExt = 'jpg';
    }
  } else if (options.outputFormat === 'png') {
    mimeType = 'image/png';
    outExt = 'png';
  } else if (options.outputFormat === 'webp') {
    mimeType = 'image/webp';
    outExt = 'webp';
  } else {
    mimeType = 'image/jpeg';
    outExt = 'jpg';
  }

  // Fill solid white background if converting transparent to JPEG
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image encoding failed.'));
          return;
        }

        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const outputFileName = `${baseName}-compressed.${outExt}`;
        const outputBlobUrl = URL.createObjectURL(blob);

        const origSize = file.size;
        const outSize = blob.size;
        const savedBytes = Math.max(0, origSize - outSize);
        const savedPercent = origSize > 0 ? Math.round((savedBytes / origSize) * 100) : 0;

        resolve({
          file,
          outputBlob: blob,
          outputBlobUrl,
          outputFileName,
          metrics: {
            originalSizeBytes: origSize,
            outputSizeBytes: outSize,
            savedBytes,
            savedPercent,
            originalWidth: origW,
            originalHeight: origH,
            outputWidth: targetW,
            outputHeight: targetH
          }
        });
      },
      mimeType,
      options.quality
    );
  });
}

/**
 * Resizes an image file in browser RAM
 */
export async function resizeImageFile(
  file: File,
  options: ResizeImageOptions
): Promise<ProcessedImageResult> {
  const { img, width: origW, height: origH } = await loadImageElement(file);

  let targetW = origW;
  let targetH = origH;

  if (options.scalePercent && options.scalePercent > 0) {
    const factor = options.scalePercent / 100;
    targetW = Math.max(1, Math.round(origW * factor));
    targetH = Math.max(1, Math.round(origH * factor));
  } else {
    if (options.width && options.height) {
      targetW = options.width;
      targetH = options.height;
    } else if (options.width) {
      targetW = options.width;
      targetH = options.maintainAspectRatio ? Math.round(origH * (options.width / origW)) : origH;
    } else if (options.height) {
      targetH = options.height;
      targetW = options.maintainAspectRatio ? Math.round(origW * (options.height / origH)) : origW;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('HTML5 Canvas 2D context could not be initialized.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  let mimeType = 'image/jpeg';
  let outExt = 'jpg';

  if (options.outputFormat === 'png') {
    mimeType = 'image/png';
    outExt = 'png';
  } else if (options.outputFormat === 'webp') {
    mimeType = 'image/webp';
    outExt = 'webp';
  } else {
    mimeType = 'image/jpeg';
    outExt = 'jpg';
  }

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  if (options.mode === 'cover') {
    const scale = Math.max(targetW / origW, targetH / origH);
    const scaledW = origW * scale;
    const scaledH = origH * scale;
    const dx = (targetW - scaledW) / 2;
    const dy = (targetH - scaledH) / 2;
    ctx.drawImage(img, dx, dy, scaledW, scaledH);
  } else if (options.mode === 'contain') {
    const scale = Math.min(targetW / origW, targetH / origH);
    const scaledW = origW * scale;
    const scaledH = origH * scale;
    const dx = (targetW - scaledW) / 2;
    const dy = (targetH - scaledH) / 2;
    ctx.drawImage(img, dx, dy, scaledW, scaledH);
  } else {
    // Exact stretch or aspect fit
    ctx.drawImage(img, 0, 0, targetW, targetH);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image resize encoding failed.'));
          return;
        }

        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const outputFileName = `${baseName}-${targetW}x${targetH}.${outExt}`;
        const outputBlobUrl = URL.createObjectURL(blob);

        const origSize = file.size;
        const outSize = blob.size;
        const savedBytes = Math.max(0, origSize - outSize);
        const savedPercent = origSize > 0 ? Math.round((savedBytes / origSize) * 100) : 0;

        resolve({
          file,
          outputBlob: blob,
          outputBlobUrl,
          outputFileName,
          metrics: {
            originalSizeBytes: origSize,
            outputSizeBytes: outSize,
            savedBytes,
            savedPercent,
            originalWidth: origW,
            originalHeight: origH,
            outputWidth: targetW,
            outputHeight: targetH
          }
        });
      },
      mimeType,
      options.quality
    );
  });
}

/**
 * Creates a downloadable ZIP archive containing multiple processed files
 */
export async function createBatchZip(
  items: { blob: Blob; fileName: string }[],
  zipFilename: string = 'anyfilex-processed-files.zip'
): Promise<{ zipBlob: Blob; zipUrl: string }> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  items.forEach((item) => {
    zip.file(item.fileName, item.blob);
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const zipUrl = URL.createObjectURL(zipBlob);
  return { zipBlob, zipUrl };
}
