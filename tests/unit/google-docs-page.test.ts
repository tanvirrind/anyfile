import { describe, it, expect } from 'vitest';
import { generateMetadata } from '../../src/app/software/[id]/page';
import { GOOGLE_DOCS_FAQS } from '../../src/components/software/GoogleDocsDetailView';

describe('Google Docs software page App Router SEO and content', () => {
  it('generates the current page title, description, canonical, and article metadata', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ id: 'google-docs' }) });
    const description = metadata.description ?? '';
    expect(metadata.title).toBe('Google Docs File Types: What Files Can Google Docs Open?');
    expect(description).toContain('DOCX');
    expect(description).toContain('EPUB');
    expect(description.length).toBeLessThanOrEqual(160);
    expect(metadata.alternates?.canonical).toBe('https://anyfilex.com/software/google-docs');
    expect(metadata.openGraph).toBeDefined();
  });

  it('keeps the current Google Docs FAQ content complete', () => {
    expect(GOOGLE_DOCS_FAQS.length).toBeGreaterThanOrEqual(6);
    const questions = GOOGLE_DOCS_FAQS.map((faq) => faq.question);
    expect(questions.some((question) => question.includes('native file extension'))).toBe(true);
    expect(questions.some((question) => question.includes('What file formats can Google Docs open'))).toBe(true);
    expect(questions.some((question) => question.includes('export or download'))).toBe(true);
  });
});
