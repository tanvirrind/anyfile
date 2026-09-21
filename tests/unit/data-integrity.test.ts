import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { sha256Hex } from '../../src/utils/hashUtils';
import { convertFileInBrowser } from '../../src/lib/converter/engine';
import { detectFileFormat } from '../../src/lib/analyzer/detectionEngine';

describe('Fix #6 — SHA-256 must be a real full digest (no truncation/fake)', () => {
  it('matches the published digest for "abc"', async () => {
    const bytes = new TextEncoder().encode('abc');
    expect(await sha256Hex(bytes.buffer)).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });

  it('matches the published digest for the empty input', async () => {
    expect(await sha256Hex(new ArrayBuffer(0))).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });
});

describe('Fix #7 — unsupported converters must throw, never silently rename', () => {
  it.each([
    ['dwg', 'pdf'],
    ['dwg', 'dxf'],
    ['psd', 'jpg'],
    ['step', 'stl'],
    ['eml', 'pdf'],
  ])('rejects %s -> %s with an explicit error', async (from, to) => {
    const file = new File(['placeholder bytes'], `sample.${from}`);
    await expect(convertFileInBrowser(file, from, to)).rejects.toThrow(/not supported/i);
  });
});

describe('Fix #8 — ZIP sub-type detection from archive contents', () => {
  async function zipBytes(entries: Record<string, string>): Promise<Uint8Array> {
    const zip = new JSZip();
    for (const [name, content] of Object.entries(entries)) zip.file(name, content);
    return new Uint8Array(await zip.generateAsync({ type: 'nodebuffer' }));
  }

  it.each([
    ['docx', { '[Content_Types].xml': '<t/>', 'word/document.xml': '<d/>' }],
    ['xlsx', { '[Content_Types].xml': '<t/>', 'xl/workbook.xml': '<w/>' }],
    ['pptx', { '[Content_Types].xml': '<t/>', 'ppt/presentation.xml': '<p/>' }],
    ['apk', { 'AndroidManifest.xml': '<m/>' }],
  ])('detects %s even when the filename claims .zip', async (expected, entries) => {
    const bytes = await zipBytes(entries as Record<string, string>);
    const result = detectFileFormat(bytes, 'innocent.zip', 'application/zip');
    // The top-level detectedExtension field is dot-less by convention (callers prepend '.').
    expect(result.detectedExtension.toLowerCase()).toBe(expected);
  });

  it('still reports a plain ZIP container as a ZIP', async () => {
    const bytes = await zipBytes({ 'readme.txt': 'hello world' });
    const result = detectFileFormat(bytes, 'archive.zip', 'application/zip');
    expect(result.detectedExtension.toLowerCase()).toBe('zip');
  });
});
