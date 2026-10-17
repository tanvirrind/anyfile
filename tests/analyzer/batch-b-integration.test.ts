/**
 * Batch B integration: analyzeFile -> structure -> security indicators.
 */
import { describe, expect, it } from 'vitest';
import { analyzeFile } from '@/lib/analyzer/fileAnalyzerService';

async function buildDocmZip(): Promise<File> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<Types/>');
  zip.file('word/document.xml', '<w:document/>');
  zip.file('word/vbaProject.bin', new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
  const buf = await zip.generateAsync({ type: 'uint8array' });
  return new File([buf as BlobPart], 'report.docm', { type: 'application/vnd.ms-word.document.macroEnabled.12' });
}

describe('analyzeFile structure wiring', () => {
  it('attaches zip structure and fires the macro indicator', async () => {
    const file = await buildDocmZip();
    const analysis = await analyzeFile(file);
    expect(analysis.structure?.family).toBe('zip');
    expect(analysis.structure?.available).toBe(true);
    expect(analysis.structure?.zip?.hasMacros).toBe(true);
    expect(analysis.security.isMacroEnabled).toBe(true);
    expect(analysis.security.indicators.some((i) => i.id === 'struct_macro')).toBe(true);
    // Serializable: no functions, no class instances in the structure section
    const json = JSON.stringify(analysis.structure);
    expect(typeof json).toBe('string');
    expect(json).toContain('vbaProject.bin');
  }, 60000);

  it('marks RAR as archive_limited without failing the analysis', async () => {
    const rar = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00]);
    const file = new File([rar], 'a.rar');
    const analysis = await analyzeFile(file);
    expect(analysis.structure?.family).toBe('archive_limited');
    expect(analysis.structure?.available).toBe(false);
    expect(analysis.detectedExtension).toBeTruthy();
  }, 60000);
});
