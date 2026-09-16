export interface DocumentInspectionResult {
  fileName: string;
  format: string;
  fileSize: number;
  pageCount?: number;
  isEncrypted: boolean;
  textSnippet?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Converts a list of image files or blobs into a single printable PDF document using jsPDF in browser memory.
 */
export async function convertImagesToPdf(
  images: Array<{ blob: Blob; fileName: string; width?: number; height?: number }>,
  options: { title?: string; orientation?: 'portrait' | 'landscape' } = {}
): Promise<{ pdfBlob: Blob; pdfUrl: string; size: number }> {
  if (images.length === 0) {
    throw new Error('No images provided for PDF document generation.');
  }

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    if (i > 0) {
      doc.addPage('a4', options.orientation || 'portrait');
    }

    const dataUrl = await blobToDataUrl(item.blob);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Compute dimensions fitting within margins (40pt padding)
    const margin = 40;
    const availWidth = pageWidth - margin * 2;
    const availHeight = pageHeight - margin * 2;

    const imgWidth = item.width || 800;
    const imgHeight = item.height || 600;
    const ratio = Math.min(availWidth / imgWidth, availHeight / imgHeight);

    const drawWidth = imgWidth * ratio;
    const drawHeight = imgHeight * ratio;
    const posX = margin + (availWidth - drawWidth) / 2;
    const posY = margin + (availHeight - drawHeight) / 2;

    // Detect image type for jsPDF
    const format = item.fileName.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
    doc.addImage(dataUrl, format, posX, posY, drawWidth, drawHeight, undefined, 'FAST');
  }

  const pdfArrayBuffer = doc.output('arraybuffer');
  const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(pdfBlob);

  return {
    pdfBlob,
    pdfUrl,
    size: pdfBlob.size
  };
}

/**
 * Helper to convert Blob to base64 Data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read binary data buffer for PDF rasterization.'));
    reader.readAsDataURL(blob);
  });
}
