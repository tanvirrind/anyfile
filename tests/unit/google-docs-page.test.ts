import { describe, it, expect } from 'vitest';
import { deriveDynamicMetadata } from '../../src/lib/seo/dynamicPageSeo';
import { GOOGLE_DOCS_FAQS } from '../../src/components/software/GoogleDocsDetailView';

describe('Google Docs Software Page SEO and Content Quality', () => {
  const seoData = deriveDynamicMetadata(
    {
      view: 'software-detail',
      id: 'google-docs'
    },
    'https://anyfilex.com/software/google-docs'
  );

  it('1. SEO title clearly matches search intent', () => {
    expect(seoData.title).toBe('Google Docs File Types: What Files Can Google Docs Open?');
  });

  it('2. Meta description summarizes supported import and export formats and fits within search snippet limits', () => {
    expect(seoData.description).toContain('Google Docs can open and export');
    expect(seoData.description).toContain('DOCX');
    expect(seoData.description).toContain('EPUB');
    expect(seoData.description.length).toBeLessThanOrEqual(160);
    expect(seoData.description.length).toBeGreaterThan(80);
  });

  it('3. SSR prerendered HTML introduces Google Docs and explains lack of native extension', () => {
    const html = seoData.prerenderedHtml || '';
    expect(html).toContain('Google Docs File Types: What Files Can Google Docs Open &amp; Export?'.replace('&amp;', '&'));
    expect(html).toContain('.gdoc');
    expect(html).toContain('native file extension');
  });

  it('4. Formats matrix covers import vs export and limitations', () => {
    const html = seoData.prerenderedHtml || '';
    expect(html).toContain('.DOCX');
    expect(html).toContain('.ODT');
    expect(html).toContain('.PDF');
    expect(html).toContain('.EPUB');
    expect(html).toContain('.RTF');
    expect(html).toContain('.TXT');
    expect(html).toContain('.HTML');
    expect(html).toContain('OCR');
    expect(html).toContain('Important Limitations');
  });

  it('5. Practical instructions explain how to upload and open files', () => {
    const html = seoData.prerenderedHtml || '';
    expect(html).toContain('How to Upload and Open Files in Google Docs');
    expect(html).toContain('Google Drive');
    expect(html).toContain('File upload');
  });

  it('6. FAQs address key user search questions', () => {
    expect(GOOGLE_DOCS_FAQS.length).toBeGreaterThanOrEqual(6);
    const questions = GOOGLE_DOCS_FAQS.map(f => f.question);
    expect(questions.some(q => q.includes('native file extension'))).toBe(true);
    expect(questions.some(q => q.includes('What file formats can Google Docs open'))).toBe(true);
    expect(questions.some(q => q.includes('edit Microsoft Word (.docx)'))).toBe(true);
    expect(questions.some(q => q.includes('export or download'))).toBe(true);
    expect(questions.some(q => q.includes('formatting change'))).toBe(true);
    expect(questions.some(q => q.includes('maximum file size'))).toBe(true);
  });

  it('7. Schema.org structured data contains SoftwareApplication, FAQPage, and HowTo', () => {
    const schemas = seoData.specificSchemas || [];
    const types = schemas.map(s => s['@type']);
    expect(types).toContain('SoftwareApplication');
    expect(types).toContain('FAQPage');
    expect(types).toContain('HowTo');
  });
});
