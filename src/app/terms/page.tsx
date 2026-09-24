import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms governing access to AnyFileX file format guides, browser-based tools, converters, and related services.',
  alternates: {
    canonical: 'https://www.anyfilex.com/terms',
  },
  openGraph: {
    title: 'Terms of Service – AnyFileX',
    description: 'Read the terms governing access to AnyFileX file format guides, browser-based tools, converters, and related services.',
    url: 'https://www.anyfilex.com/terms',
    type: 'website',
  },
};

const sections = [
  {
    title: '1. Agreement to these terms',
    content: (
      <p>
        These Terms of Service govern your access to and use of AnyFileX, including its website, file format information, browser-based tools, converters, viewers, analyzers, and assistant. By using AnyFileX, you agree to follow these terms. If you do not agree, do not use the service.
      </p>
    ),
  },
  {
    title: '2. Eligibility and acceptable use',
    content: (
      <>
        <p>
          You may use AnyFileX only when you can legally enter into these terms. You are responsible for your use of the service and for making sure your use complies with applicable laws and regulations.
        </p>
        <p>
          Do not use AnyFileX to distribute malware, infringe another person’s rights, attack or probe systems, evade security controls, interfere with service operation, or process files you do not have permission to handle. Do not use the service for emergency, safety-critical, or high-risk decisions.
        </p>
      </>
    ),
  },
  {
    title: '3. Browser-based file processing',
    content: (
      <p>
        Many tools process files locally in your browser. You are responsible for choosing appropriate files, reviewing results, and maintaining your own backups. A browser-based result may be incomplete or unsuitable for your intended purpose, especially for uncommon, damaged, encrypted, proprietary, or very large files. When a tool requires a server-backed request, the feature should identify that requirement before use.
      </p>
    ),
  },
  {
    title: '4. Information and results are provided for general use',
    content: (
      <p>
        File format descriptions, compatibility information, conversion results, security guidance, and assistant responses are provided for general informational and technical purposes. We work to keep the catalog useful and accurate, but formats, software support, browser behavior, and security conditions can change. Verify important results with the relevant format specification, software vendor, or qualified professional before relying on them.
      </p>
    ),
  },
  {
    title: '5. Assistant and third-party links',
    content: (
      <p>
        Assistant responses are generated from the application’s available knowledge and may be incomplete or incorrect. They are not professional, legal, security, or technical advice. Any links to third-party software, websites, or services are provided for convenience; AnyFileX does not control or guarantee those third parties, their content, or their availability.
      </p>
    ),
  },
  {
    title: '6. Intellectual property',
    content: (
      <p>
        AnyFileX and its original software, layout, branding, text, graphics, and databases are protected by applicable intellectual property laws. These terms give you permission to access and use the service for lawful personal or internal business purposes; they do not transfer ownership. Do not copy, scrape, resell, or create a competing service from substantial parts of AnyFileX without permission, except where applicable law allows it.
      </p>
    ),
  },
  {
    title: '7. Your content and permissions',
    content: (
      <p>
        You retain rights in files and text you submit. You represent that you have the rights and permissions needed to use that content with AnyFileX. You grant only the limited permissions needed to operate a feature you choose to use. Do not submit confidential, regulated, or sensitive information unless you have assessed the risks and the feature is appropriate for it.
      </p>
    ),
  },
  {
    title: '8. Availability and changes',
    content: (
      <p>
        AnyFileX may change, suspend, or discontinue a feature, route, format catalog entry, or part of the service. We may also update these terms as the service changes. The effective date below identifies the latest revision. Continued use after an update means you accept the revised terms.
      </p>
    ),
  },
  {
    title: '9. Disclaimers',
    content: (
      <p>
        To the maximum extent permitted by law, AnyFileX is provided on an “as is” and “as available” basis without warranties of any kind, express or implied. We do not promise that every tool will be uninterrupted, error-free, secure, compatible with every file, or suitable for a particular purpose. You use the service and its results at your own risk.
      </p>
    ),
  },
  {
    title: '10. Limitation of liability',
    content: (
      <p>
        To the maximum extent permitted by law, AnyFileX and its contributors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive losses, or for loss of files, data, revenue, profits, or business opportunities arising from or related to your use of the service. Nothing in these terms excludes liability that cannot legally be excluded.
      </p>
    ),
  },
  {
    title: '11. Contact',
    content: (
      <p>
        Questions about these terms can be sent through the <Link className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/contact">AnyFileX contact page</Link>. Do not include passwords, private keys, or confidential files in a support request.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">AnyFileX legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            The rules and responsibilities that apply when you use AnyFileX and its file tools.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Effective date: September 24, 2026</p>
        </header>

        <div className="space-y-8 text-base leading-7 text-slate-700 dark:text-slate-300">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
              <div className="mt-4 space-y-4">{section.content}</div>
            </section>
          ))}
        </div>

        <nav aria-label="Terms navigation" className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
          <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/">Back to AnyFileX</Link>
          <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/privacy">Privacy Policy</Link>
          <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/contact">Contact AnyFileX</Link>
        </nav>
      </div>
    </article>
  );
}
