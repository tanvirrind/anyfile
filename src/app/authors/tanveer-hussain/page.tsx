import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const canonicalUrl = 'https://anyfilex.com/authors/tanveer-hussain';

export const metadata: Metadata = {
  title: 'Tanveer Hussain – AnyFileX Author',
  description: 'Author profile for Tanveer Hussain, writing about digital file formats, web systems, structured data, and privacy-aware tools.',
  alternates: { canonical: canonicalUrl },
  authors: [{ name: 'Tanveer Hussain', url: canonicalUrl }],
  openGraph: {
    title: 'Tanveer Hussain – AnyFileX Author',
    description: 'Author profile for Tanveer Hussain, writing about digital file formats, web systems, structured data, and privacy-aware tools.',
    url: canonicalUrl,
    type: 'profile',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tanveer Hussain – AnyFileX Author' }],
  },
};

const AUTHOR_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${canonicalUrl}#person`,
  name: 'Tanveer Hussain',
  url: canonicalUrl,
  image: 'https://anyfilex.com/tanveer-hussain.png',
  sameAs: [
    'https://tanvirrind.vercel.app',
    'https://linkedin.com/in/tanvirrind/',
    'https://tanlytics.com/about/',
  ],
  knowsAbout: [
    'Digital file formats',
    'Web development',
    'Technical SEO',
    'Structured data',
    'Web performance',
    'Privacy-aware browser tools',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'AnyFileX',
    url: 'https://anyfilex.com',
  },
};

export default function TanveerHussainAuthorPage() {
  return (
    <>
      <script
        id="json-ld-tanveer-hussain"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(AUTHOR_JSON_LD) }}
      />

      <article className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/authors" className="hover:text-blue-600 dark:hover:text-blue-400">Authors</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>Tanveer Hussain</span>
          </nav>

          <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Image
                src="/tanveer-hussain.png"
                alt="Tanveer Hussain"
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-3xl object-cover shadow-lg dark:border dark:border-slate-700"
                priority
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">AnyFileX Author</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Tanveer Hussain</h1>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">Web systems, digital file formats, and practical technical guidance</p>
              </div>
            </div>
          </header>

          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_250px]">
            <div className="space-y-8 text-base leading-8 text-slate-700 dark:text-slate-300">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About the author</h2>
                <div className="mt-4 space-y-4">
                  <p>
                    Tanveer Hussain is a web developer and technical content creator focused on making complex digital systems easier to understand and use. His work brings together web architecture, technical SEO, structured data, performance, and practical documentation.
                  </p>
                  <p>
                    At AnyFileX, Tanveer writes clear, evidence-led content about file extensions, MIME types, magic bytes, software compatibility, conversion workflows, and privacy-aware browser tools. His goal is to help readers identify files accurately, choose appropriate software, and understand what happens to their data when they use an online tool.
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Areas of focus</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    'Digital file formats and extensions',
                    'File signatures and MIME types',
                    'Browser-based file tools',
                    'Technical SEO and structured data',
                    'Web performance and site architecture',
                    'Privacy-aware user experiences',
                  ].map((item) => (
                    <li key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item}</li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How he approaches technical content</h2>
                <p className="mt-4">
                  Tanveer prioritizes plain-language explanations, verifiable technical details, clear limitations, and actionable steps. File-related guidance is written to distinguish documented format behavior from assumptions, and privacy considerations are included whenever a workflow handles personal files or embedded metadata.
                </p>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Public profiles</h2>
              <div className="mt-4 space-y-3 text-sm">
                <a className="block font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://tanvirrind.vercel.app" target="_blank" rel="noreferrer">Personal website</a>
                <a className="block font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://linkedin.com/in/tanvirrind/" target="_blank" rel="noreferrer">LinkedIn profile</a>
                <a className="block font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://tanlytics.com/about/" target="_blank" rel="noreferrer">Tanlytics profile</a>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
