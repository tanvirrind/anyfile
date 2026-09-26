import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseEml, parseMbox, sanitizeEmailHtml } from '../../src/lib/email/emailEngine';
import { parseStl, repairStl } from '../../src/lib/3d/stlEngine';
import { detectFileFormat } from '../../src/lib/analyzer/detectionEngine';

const fixture = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), 'tests', 'fixtures', relativePath), 'utf8');

describe('fixture-backed email safety and destinations', () => {
  it('removes active content and remote resources from an EML HTML body', () => {
    const email = parseEml(fixture('email/malicious.eml'));

    expect(email.format).toBe('eml');
    expect(email.textBody).toContain('Safe message');
    expect(email.htmlBody).toContain('Safe message');
    expect(email.htmlBody).not.toMatch(/script|iframe|onerror|https?:|javascript:|style/i);
  });

  it('indexes separate MBOX messages without retaining the Unix separator as a header', () => {
    const items = parseMbox(fixture('email/sample.mbox'));

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.subject)).toEqual(['First fixture message', 'Second fixture message']);
    expect(items[0].rawContent).not.toMatch(/^From [^:]+\nFrom:/);
  });

  it('keeps the sanitizer safe in non-DOM test/runtime contexts', () => {
    const sanitized = sanitizeEmailHtml('<img src="data:image/png;base64,AAAA"><img src="https://x.invalid/a">');
    expect(sanitized).toContain('data:image/png');
    expect(sanitized).not.toContain('https://x.invalid');
  });
});

describe('fixture-backed STL normalization', () => {
  it('diagnoses and normalizes facets without claiming hole repair', () => {
    const bytes = new TextEncoder().encode(fixture('3d/tetrahedron.stl'));
    const parsed = parseStl(bytes.buffer);
    const result = repairStl(bytes.buffer);

    expect(parsed.diagnostics.triangleCount).toBe(4);
    expect(result.originalTriangles).toBe(4);
    expect(result.repairedTriangles).toBe(4);
    expect(result.recalculatedNormalsCount).toBe(4);
    expect(result.diagnostics.isWatertight).toBe(true);
  });
});

describe('fixture-backed SolidWorks signature detection', () => {
  it.each(['sldprt', 'sldasm'])('recognizes a compound-file %s signature only with its matching extension', (extension) => {
    const bytes = new Uint8Array(128);
    bytes.set([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

    const result = detectFileFormat(bytes, `fixture.${extension}`, 'application/octet-stream');

    expect(result.detectedExtension.toLowerCase()).toBe(extension);
  });
});
