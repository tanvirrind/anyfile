import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how AnyFileX handles files, messages, local browser storage, and privacy when you use our file intelligence tools.',
  alternates: {
    canonical: 'https://www.anyfilex.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy – AnyFileX',
    description: 'Learn how AnyFileX handles files, messages, local browser storage, and privacy when you use our file intelligence tools.',
    url: 'https://www.anyfilex.com/privacy',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
};

const sections = [
  {
    title: '1. What this policy covers',
    content: (
      <p>
        This Privacy Policy explains how AnyFileX handles information when you browse the site or use its file format guides, converters, viewers, analyzers, and other tools. AnyFileX is designed to keep ordinary file processing in your browser. This policy applies to the public AnyFileX website and its associated application endpoints.
      </p>
    ),
  },
  {
    title: '2. Files and browser-based tools',
    content: (
      <>
        <p>
          Many AnyFileX tools read, inspect, convert, compress, or repair files locally in your browser. For these tools, the selected file is handled in browser memory and is not uploaded to AnyFileX as part of the normal workflow. When a tool explicitly needs a server request, its page will explain that requirement before use.
        </p>
        <p>
          Your files can still be exposed to other software or browser extensions running on your device. Only select files you are comfortable opening in your browser, and close the page when you are finished with sensitive work.
        </p>
      </>
    ),
  },
  {
    title: '3. Assistant messages',
    content: (
      <p>
        If you use the AnyFileX assistant, the message you submit is sent to the AnyFileX application endpoint so it can return a response. The current assistant endpoint uses the application’s local knowledge fallback and does not call the Gemini API. Do not submit passwords, private documents, financial information, or other sensitive personal information in assistant messages.
      </p>
    ),
  },
  {
    title: '4. Local browser storage',
    content: (
      <p>
        AnyFileX may use browser storage for features such as your color-theme preference and temporary, user-requested analysis results. This information remains in your browser unless you clear it or the application feature removes it. You can clear site data through your browser settings. Disabling browser storage may affect some interactive features.
      </p>
    ),
  },
  {
    title: '5. Server requests and technical information',
    content: (
      <p>
        Requests to load pages or use server-backed endpoints may be handled by our hosting and infrastructure providers. Those providers may process ordinary technical information needed to deliver and secure the service, such as an IP address, request time, user agent, response status, and diagnostic logs. Any retention of this information is governed by the applicable infrastructure provider and operational requirements.
      </p>
    ),
  },
  {
    title: '6. Cookies, advertising, and third parties',
    content: (
      <p>
        AnyFileX does not use file contents for advertising. The site may contain links to third-party websites, software, or services. Their privacy practices are controlled by their own policies, so review those policies before sharing information with them. The site may also use essential platform mechanisms required for hosting, security, or reliable operation.
      </p>
    ),
  },
  {
    title: '7. Children and sensitive information',
    content: (
      <p>
        AnyFileX is a general-purpose technical website and is not directed at collecting information from children. Do not submit sensitive personal information, confidential business material, authentication credentials, or regulated data to the site or assistant.
      </p>
    ),
  },
  {
    title: '8. Your choices and questions',
    content: (
      <p>
        You can stop using the site, clear AnyFileX data from your browser, and avoid submitting information to server-backed features. For privacy questions or requests about information you voluntarily sent to AnyFileX, use the <Link className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/contact">contact page</Link> and include enough detail for us to identify the request without sending sensitive information.
      </p>
    ),
  },
  {
    title: '9. Policy updates',
    content: (
      <p>
        We may update this policy when the site, its tools, or applicable requirements change. The effective date below identifies the latest revision. Continued use of AnyFileX after an update means the revised policy applies to future use of the site.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">AnyFileX legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A clear explanation of how AnyFileX handles files, messages, browser storage, and technical information.
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

        <nav aria-label="Privacy policy navigation" className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
          <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/">Back to AnyFileX</Link>
          <Link className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="/contact">Contact AnyFileX</Link>
        </nav>
      </div>
    </article>
  );
}
