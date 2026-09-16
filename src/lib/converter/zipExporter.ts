import { QueueItem } from './types';

/**
 * Creates a ZIP archive containing all completed converted items.
 * @param items Completed queue items with resultBlobUrl
 * @param zipFilename Name of the generated zip file (default: "converted_files.zip")
 * @param onProgress Callback for compression progress (0 to 100)
 */
export async function createZipFromQueueItems(
  items: QueueItem[],
  zipFilename: string = 'converted_files.zip',
  onProgress?: (percent: number) => void
): Promise<{ zipBlobUrl: string; filename: string; size: number }> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  const completed = items.filter((item) => item.status === 'completed' && item.resultBlobUrl);
  if (completed.length === 0) {
    throw new Error('No completed converted files available to package into ZIP.');
  }

  // Fetch blob data for each item and add to zip
  for (let i = 0; i < completed.length; i++) {
    const item = completed[i];
    const filename = item.resultFileName || `${item.name.replace(/\.[^/.]+$/, '')}.${item.toExt}`;

    try {
      const response = await fetch(item.resultBlobUrl!);
      const blob = await response.blob();
      zip.file(filename, blob);
    } catch (err) {
      console.error(`Failed to fetch blob for file ${filename}:`, err);
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / completed.length) * 50));
    }
  }

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) {
        onProgress(50 + Math.round(metadata.percent / 2));
      }
    }
  );

  const zipBlobUrl = URL.createObjectURL(zipBlob);
  return {
    zipBlobUrl,
    filename: zipFilename,
    size: zipBlob.size,
  };
}
