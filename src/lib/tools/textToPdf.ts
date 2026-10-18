/**
 * Plain-text to PDF generation (jsPDF, dynamically imported).
 * Plain text only — no rich formatting, images, or embedded fonts.
 */

export interface TextPdfOptions {
  title?: string;
  fontSize?: number;
  pageSize?: 'a4' | 'letter';
}

export async function generateTextPdf(text: string, opts: TextPdfOptions = {}): Promise<Uint8Array> {
  const { jsPDF } = await import('jspdf');
  const { title = '', fontSize = 12, pageSize = 'a4' } = opts;
  const doc = new jsPDF({ unit: 'pt', format: pageSize, compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageWidth - margin * 2;
  let cursorY = margin;

  if (title.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const titleLines: string[] = doc.splitTextToSize(title.trim(), maxWidth);
    for (const line of titleLines) {
      if (cursorY > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 24;
    }
    cursorY += 10;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  const lineHeight = fontSize * 1.5;
  const paragraphs = text.split(/\n\s*\n/);
  for (const para of paragraphs) {
    const wrapped: string[] = doc.splitTextToSize(para.replace(/\n/g, ' ').trim() || ' ', maxWidth);
    for (const line of wrapped) {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    }
    cursorY += lineHeight * 0.6;
  }

  const totalPages = doc.getNumberOfPages();
  doc.setFontSize(9);
  doc.setTextColor(120);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${totalPages} — created with AnyFileX`, pageWidth / 2, pageHeight - 32, { align: 'center' });
  }

  return new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
}
