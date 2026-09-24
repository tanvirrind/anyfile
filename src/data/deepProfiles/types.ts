/**
 * Types for deep, SEO-optimised per-format content profiles.
 *
 * The generated extension pages (see extensionGenerator / dynamicPageSeo) are
 * built from compact data records, which keeps ~250 formats consistent but makes
 * any single page too thin to compete for a high-value keyword cluster. A deep
 * profile lets one format carry genuinely long-form, terminology-dense content —
 * sections, tables, step lists and an FAQ set matched to the real People-Also-Ask
 * box — plus the structured data that answer engines read.
 */

export interface DeepProfileSection {
  /** Anchor id, also used for the on-page table of contents. */
  id: string;
  h2: string;
  /** Authored inline HTML (p, strong, a, ul/li). Trusted content, not user input. */
  html: string;
  table?: { caption?: string; headers: string[]; rows: string[][] };
  steps?: { title: string; desc: string }[];
  list?: string[];
}

export interface DeepProfileFaq {
  q: string;
  a: string;
}

export interface DeepFormatProfile {
  /** The keyword cluster this profile targets. */
  keywords: string[];
  /** SEO title, sized for the SERP (~55-62 chars). */
  title: string;
  /** Meta description (~150-158 chars). */
  metaDescription: string;
  /** 40-60 word direct answer, for AI Overviews and the definitional snippet. */
  definition: string;
  sections: DeepProfileSection[];
  faqs: DeepProfileFaq[];
  /** Hub-and-spoke internal links. */
  relatedLinks: { href: string; label: string }[];
  /** Powers HowTo structured data. */
  howTo: { name: string; steps: { name: string; text: string }[] };
}
