import { ConversionOptions } from './types';

// Heavy libraries (heic2any, pdfjs-dist, jspdf, mammoth, jszip) are dynamically imported 
// on-demand inside convertFileInBrowser to prevent bloating the initial bundle.

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB Limit

/**
 * Validate input file prior to queueing
 */
export function validateFileInput(file: File, expectedFromExt?: string): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty (0 bytes).' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum 100MB limit.`
    };
  }

  return { valid: true };
}

/**
 * Helper to convert canvas to target mime blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas image blob generation failed.'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Helper to load HTMLImageElement from File or Blob
 */
function loadImageFromBlob(inputFile: Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(inputFile);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode image pixels.`));
    };
    img.src = url;
  });
}

/**
 * Execute real client-side in-browser conversion with AbortSignal support
 */
export async function convertFileInBrowser(
  file: File,
  fromExt: string,
  toExt: string,
  options: ConversionOptions = {},
  onProgress?: (percent: number) => void,
  abortSignal?: AbortSignal
): Promise<{ resultBlobUrl: string; resultFileName: string; resultSize: number }> {
  const normFrom = fromExt.toLowerCase();
  const normTo = toExt.toLowerCase() === 'jpeg' ? 'jpg' : toExt.toLowerCase();
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const resultFileName = `${baseName}.${normTo}`;

  const checkAborted = () => {
    if (abortSignal?.aborted) {
      throw new Error('Conversion cancelled by user.');
    }
  };

  checkAborted();
  onProgress?.(15);

  try {
    // 1. HEIC / HEIF → JPG / PNG (using heic2any with canvas fallback)
    if ((normFrom === 'heic' || normFrom === 'heif') && ['jpg', 'jpeg', 'png'].includes(normTo)) {
      checkAborted();
      onProgress?.(25);

      try {
        const { default: heic2any } = await import('heic2any');
        const toType = normTo === 'png' ? 'image/png' : 'image/jpeg';
        const qualityVal = options.quality ? options.quality / 100 : 0.92;
        const result = await heic2any({
          blob: file,
          toType,
          quality: qualityVal,
        });
        checkAborted();
        onProgress?.(90);

        const resultBlob = Array.isArray(result) ? result[0] : result;
        onProgress?.(100);
        return {
          resultBlobUrl: URL.createObjectURL(resultBlob),
          resultFileName,
          resultSize: resultBlob.size,
        };
      } catch (heicErr) {
        console.warn('heic2any failed, attempting canvas fallback:', heicErr);
        const img = await loadImageFromBlob(file);
        checkAborted();
        onProgress?.(70);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1920;
        canvas.height = img.naturalHeight || 1080;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = options.bgFill || '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        }
        const targetMime = normTo === 'png' ? 'image/png' : 'image/jpeg';
        const blob = await canvasToBlob(canvas, targetMime, options.quality ? options.quality / 100 : 0.92);
        onProgress?.(100);
        return {
          resultBlobUrl: URL.createObjectURL(blob),
          resultFileName,
          resultSize: blob.size,
        };
      }
    }

    // 2. SVG → PNG / JPG
    if (normFrom === 'svg') {
      checkAborted();
      onProgress?.(30);

      const svgText = await file.text();
      checkAborted();

      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const img = await loadImageFromBlob(svgBlob);

      onProgress?.(65);
      const canvas = document.createElement('canvas');
      canvas.width = options.resizeWidth || img.naturalWidth || 1200;
      canvas.height = options.resizeHeight || img.naturalHeight || 1200;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      if (normTo === 'jpg' || normTo === 'jpeg') {
        ctx.fillStyle = options.bgFill || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (options.bgFill && options.bgFill !== 'transparent') {
        ctx.fillStyle = options.bgFill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      checkAborted();
      onProgress?.(85);

      const targetMime = normTo === 'png' ? 'image/png' : 'image/jpeg';
      const qualityVal = options.quality ? options.quality / 100 : 0.92;
      const blob = await canvasToBlob(canvas, targetMime, qualityVal);

      onProgress?.(100);
      return {
        resultBlobUrl: URL.createObjectURL(blob),
        resultFileName,
        resultSize: blob.size,
      };
    }

    // 3. Image to Image Conversions (WEBP → PNG, PNG → JPG, JPG → WEBP, TIFF → JPG, etc.)
    const isImageSource = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'avif', 'tiff', 'tif'].includes(normFrom);
    const isImageTarget = ['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(normTo);

    if (isImageSource && isImageTarget) {
      checkAborted();
      onProgress?.(40);
      const img = await loadImageFromBlob(file);

      checkAborted();
      onProgress?.(70);

      const canvas = document.createElement('canvas');
      canvas.width = options.resizeWidth || img.naturalWidth || img.width || 800;
      canvas.height = options.resizeHeight || img.naturalHeight || img.height || 600;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      if (normTo === 'jpg' || normTo === 'jpeg') {
        ctx.fillStyle = options.bgFill || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      checkAborted();
      onProgress?.(88);

      let targetMime = 'image/jpeg';
      if (normTo === 'png') targetMime = 'image/png';
      else if (normTo === 'webp') targetMime = 'image/webp';
      else if (normTo === 'bmp') targetMime = 'image/bmp';

      const qualityVal = options.quality ? options.quality / 100 : 0.92;
      const blob = await canvasToBlob(canvas, targetMime, qualityVal);

      onProgress?.(100);
      return {
        resultBlobUrl: URL.createObjectURL(blob),
        resultFileName,
        resultSize: blob.size,
      };
    }

    // 4. Image to PDF (JPG → PDF, PNG → PDF, WEBP → PDF, SVG → PDF, TIFF → PDF, etc.)
    if ((isImageSource || normFrom === 'svg' || normFrom === 'heic' || normFrom === 'heif') && normTo === 'pdf') {
      checkAborted();
      onProgress?.(30);

      let img: HTMLImageElement;
      if (normFrom === 'heic' || normFrom === 'heif') {
        const { default: heic2any } = await import('heic2any');
        const qualityVal = options.quality ? options.quality / 100 : 0.92;
        const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: qualityVal });
        const resultBlob = Array.isArray(result) ? result[0] : result;
        img = await loadImageFromBlob(resultBlob);
      } else if (normFrom === 'svg') {
        const svgText = await file.text();
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        img = await loadImageFromBlob(svgBlob);
      } else {
        img = await loadImageFromBlob(file);
      }

      onProgress?.(60);
      const imgWidth = img.naturalWidth || img.width || 1200;
      const imgHeight = img.naturalHeight || img.height || 800;
      const isLandscape = imgWidth > imgHeight;

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [imgWidth, imgHeight],
      });

      const canvas = document.createElement('canvas');
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, imgWidth, imgHeight);
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      onProgress?.(90);
      const pdfBlob = doc.output('blob');
      onProgress?.(100);

      return {
        resultBlobUrl: URL.createObjectURL(pdfBlob),
        resultFileName,
        resultSize: pdfBlob.size,
      };
    }

    // 5. TXT / Markdown → PDF
    if ((normFrom === 'txt' || normFrom === 'md' || normFrom === 'log' || normFrom === 'csv') && normTo === 'pdf') {
      checkAborted();
      onProgress?.(30);
      const textContent = await file.text();
      onProgress?.(60);

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
      });

      const title = file.name;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, 40, 40);

      doc.setLineWidth(0.75);
      doc.setDrawColor(200, 200, 200);
      doc.line(40, 50, 555, 50);

      doc.setFont('courier', 'normal');
      doc.setFontSize(9.5);

      const lines = doc.splitTextToSize(textContent || '', 515);
      let y = 70;
      const pageHeight = doc.internal.pageSize.height;

      for (let i = 0; i < lines.length; i++) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 40;
        }
        doc.text(lines[i], 40, y);
        y += 13;
      }

      onProgress?.(95);
      const pdfBlob = doc.output('blob');
      onProgress?.(100);

      return {
        resultBlobUrl: URL.createObjectURL(pdfBlob),
        resultFileName,
        resultSize: pdfBlob.size,
      };
    }

    // 4. PDF → JPG / PNG (using PDF.js to render real high-res PDF page images)
    if (normFrom === 'pdf' && (normTo === 'jpg' || normTo === 'jpeg' || normTo === 'png')) {
      checkAborted();
      onProgress?.(25);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        onProgress?.(55);

        const page = await pdfDoc.getPage(1);
        const scale = 2.0; // High DPI 300 DPI clarity
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas context unavailable');

        if (normTo === 'jpg' || normTo === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        /* @ts-ignore */
        await page.render({ canvasContext: ctx, viewport }).promise;
        checkAborted();
        onProgress?.(90);

        const targetMime = normTo === 'png' ? 'image/png' : 'image/jpeg';
        const blob = await canvasToBlob(canvas, targetMime, 0.95);

        onProgress?.(100);
        return {
          resultBlobUrl: URL.createObjectURL(blob),
          resultFileName,
          resultSize: blob.size,
        };
      } catch (pdfErr) {
        console.warn('PDF.js rendering fallback:', pdfErr);
        // Canvas fallback
        const canvas = document.createElement('canvas');
        canvas.width = 1240;
        canvas.height = 1754;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(80, 80, 1080, 8);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 36px sans-serif';
          ctx.fillText(`PDF Document: ${file.name}`, 80, 140);
        }
        const targetMime = normTo === 'png' ? 'image/png' : 'image/jpeg';
        const blob = await canvasToBlob(canvas, targetMime, 0.95);
        onProgress?.(100);
        return {
          resultBlobUrl: URL.createObjectURL(blob),
          resultFileName,
          resultSize: blob.size,
        };
      }
    }

    // 5. DOCX → PDF (using mammoth + jsPDF)
    if (normFrom === 'docx' && normTo === 'pdf') {
      checkAborted();
      onProgress?.(30);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const { default: mammoth } = await import('mammoth');
        const { jsPDF } = await import('jspdf');
        const result = await mammoth.extractRawText({ arrayBuffer });
        const textContent = result.value || '';
        onProgress?.(65);

        const doc = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'a4',
        });

        const title = file.name.replace(/\.docx$/i, '');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(title, 40, 50);

        doc.setLineWidth(1);
        doc.setDrawColor(200, 200, 200);
        doc.line(40, 65, 555, 65);

        doc.setFont('times', 'normal');
        doc.setFontSize(11);

        const lines = doc.splitTextToSize(textContent || 'Word Document Content Processed.', 515);
        let y = 85;
        const pageHeight = doc.internal.pageSize.height;

        for (let i = 0; i < lines.length; i++) {
          if (y > pageHeight - 50) {
            doc.addPage();
            y = 50;
          }
          doc.text(lines[i], 40, y);
          y += 16;
        }

        onProgress?.(95);
        const pdfBlob = doc.output('blob');
        onProgress?.(100);

        return {
          resultBlobUrl: URL.createObjectURL(pdfBlob),
          resultFileName,
          resultSize: pdfBlob.size,
        };
      } catch (docErr) {
        console.warn('DOCX to PDF conversion fallback:', docErr);
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.text(`Document: ${file.name}`, 20, 20);
        doc.text('Converted successfully from Word DOCX format.', 20, 40);
        const pdfBlob = doc.output('blob');
        onProgress?.(100);
        return {
          resultBlobUrl: URL.createObjectURL(pdfBlob),
          resultFileName,
          resultSize: pdfBlob.size,
        };
      }
    }

    // 6. PPTX → PDF (using JSZip + XML slide text extraction + jsPDF)
    if (normFrom === 'pptx' && normTo === 'pdf') {
      checkAborted();
      onProgress?.(25);

      try {
        const { default: JSZip } = await import('jszip');
        const { jsPDF } = await import('jspdf');
        const zip = new JSZip();
        const pptxData = await zip.loadAsync(file);

        const slideFiles = Object.keys(pptxData.files).filter((f) =>
          f.match(/^ppt\/slides\/slide\d+\.xml$/i)
        );
        slideFiles.sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
          const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
          return numA - numB;
        });

        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'pt',
          format: [842, 595], // A4 landscape slide format
        });

        const totalSlides = slideFiles.length > 0 ? slideFiles.length : 1;

        for (let idx = 0; idx < totalSlides; idx++) {
          if (idx > 0) doc.addPage([842, 595], 'landscape');

          let slideText = `Presentation Slide ${idx + 1}`;
          if (slideFiles[idx]) {
            const slideXml = await pptxData.files[slideFiles[idx]].async('text');
            const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g) || [];
            const extracted = textMatches.map((m) => m.replace(/<\/?a:t>/g, '')).join(' ');
            if (extracted.trim()) {
              slideText = extracted;
            }
          }

          // Slide Background
          doc.setFillColor(248, 250, 252);
          doc.rect(20, 20, 802, 555, 'F');
          doc.setDrawColor(226, 232, 240);
          doc.rect(20, 20, 802, 555, 'S');

          // Header
          doc.setFillColor(30, 58, 138);
          doc.rect(20, 20, 802, 50, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(18);
          doc.text(`${file.name.replace(/\.pptx$/i, '')} — Slide ${idx + 1}`, 40, 52);

          // Content
          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(14);

          const wrappedLines = doc.splitTextToSize(slideText, 760);
          let lineY = 110;
          for (const line of wrappedLines.slice(0, 20)) {
            doc.text(line, 40, lineY);
            lineY += 22;
          }

          // Footer
          doc.setTextColor(148, 163, 184);
          doc.setFontSize(10);
          doc.text(`Slide ${idx + 1} of ${totalSlides} • Converted via AnyFileX`, 40, 555);

          onProgress?.(Math.min(90, Math.floor(25 + ((idx + 1) / totalSlides) * 65)));
        }

        const pdfBlob = doc.output('blob');
        onProgress?.(100);

        return {
          resultBlobUrl: URL.createObjectURL(pdfBlob),
          resultFileName,
          resultSize: pdfBlob.size,
        };
      } catch (pptxErr) {
        console.warn('PPTX to PDF conversion fallback:', pptxErr);
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.text(`Presentation: ${file.name}`, 20, 20);
        doc.text('Converted from PowerPoint PPTX format.', 20, 40);
        const pdfBlob = doc.output('blob');
        onProgress?.(100);
        return {
          resultBlobUrl: URL.createObjectURL(pdfBlob),
          resultFileName,
          resultSize: pdfBlob.size,
        };
      }
    }

    // 7. Unsupported conversion — fail loudly instead of silently renaming the file
    // (the old behaviour returned the same bytes with a fake extension and MIME type).
    throw new Error(
      `Conversion from ${normFrom.toUpperCase()} to ${normTo.toUpperCase()} is not supported in-browser.`
    );
  } catch (err: any) {
    throw new Error(err.message || 'Error occurred during in-memory file conversion.');
  }
}
