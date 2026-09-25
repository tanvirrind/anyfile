import React from 'react';
import { ShieldCheck, Zap, Lock, Globe, Server, Code, Users, Award, Sparkles } from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { StatsCard } from '../components/StatsCard';
import { SEOHead } from '../components/SEOHead';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="About AnyFileX – Universal Digital File Intelligence"
        description="Learn about AnyFileX mission, privacy-first client-side WebAssembly architecture, and our open database of 250+ indexed file formats."
        canonicalPath="/about"
      />
      <Breadcrumb items={[{ label: 'About AnyFileX' }]} onNavigate={onNavigate} />

      {/* About AnyFileX */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            About AnyFileX
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX is a file information and online tools platform built to make working with digital files simpler.
          </p>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            We help users understand unfamiliar file extensions, identify file formats, learn which software can open different files, and use practical online tools for common file-related tasks.
          </p>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX is built and maintained by <strong>Tanveer Hussain</strong>, a digital marketing and web technology specialist focused on building useful, search-driven digital products.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://linkedin.com/in/tanvirrind/" target="_blank" rel="noreferrer">
              Founder LinkedIn Profile
            </a>
            <a className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://tanvirrind.tanlytics.com" target="_blank" rel="noreferrer">
              Founder Portfolio
            </a>
            <a className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://tanlytics.com" target="_blank" rel="noreferrer">
              Tanlytics, Parent Company
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Our Story</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX started with a simple problem: finding reliable information about a file should not require searching through multiple websites, outdated software directories, and confusing technical documentation.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            We built AnyFileX to bring file-format information and useful file tools together in one place.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            The platform is being developed as a continuously improving resource covering file extensions, formats, software compatibility, file conversions, technical information, and browser-based utilities.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Our goal is straightforward: make file-related information easier to understand and useful for both technical and non-technical users.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">What We Do</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">AnyFileX provides information and tools across several areas:</p>
          <ul className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-5">
            <li><strong>File Extension Information</strong> — Learn what different file extensions mean and how they are used.</li>
            <li><strong>File Format Guides</strong> — Understand file formats, their characteristics, and common use cases.</li>
            <li><strong>Software Compatibility</strong> — Find software commonly associated with different file types.</li>
            <li><strong>File Conversion Tools</strong> — Access browser-based tools for converting files between supported formats.</li>
            <li><strong>File Utilities</strong> — Use practical tools for common file-related tasks.</li>
            <li><strong>Technical Guides</strong> — Find explanations of file formats, MIME types, extensions, and related concepts.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            We focus on building tools that are simple to understand, fast to use, and accessible directly from a web browser.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Built by Tanveer Hussain</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX was created by <strong>Tanveer Hussain</strong>, a digital marketing and web technology professional with experience in SEO, WordPress, web development, analytics, and digital product development.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            The project combines technical development with search-focused content research to identify the file-related questions and problems people actually encounter online.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Our Parent Company</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX is a digital product developed and operated under <strong>Tanlytics</strong>.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Tanlytics</strong> is a digital growth and technology business founded by Tanveer Hussain, providing services and developing digital products across SEO, web development, digital marketing, analytics, and AI-powered automation.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX represents Tanlytics' focus on building useful, scalable web products that solve specific user problems. Visit the <a className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" href="https://tanlytics.com" target="_blank" rel="noreferrer">Tanlytics website</a> to learn more.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Our Approach</h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <div><h3 className="font-bold text-slate-900 dark:text-white">Accuracy</h3><p>We aim to provide clear and technically useful information about file formats and extensions.</p></div>
            <div><h3 className="font-bold text-slate-900 dark:text-white">Practicality</h3><p>Information should help users accomplish something, not simply describe a file format.</p></div>
            <div><h3 className="font-bold text-slate-900 dark:text-white">Accessibility</h3><p>File information and common utilities should be understandable to users regardless of their technical background.</p></div>
            <div><h3 className="font-bold text-slate-900 dark:text-white">Continuous Improvement</h3><p>AnyFileX is an actively developed platform. We continually improve existing pages, expand file-format coverage, and develop new tools based on user needs and technical research.</p></div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">A Growing File Resource</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            AnyFileX is being developed as a long-term resource for understanding and working with digital files.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            From common formats such as PDF, JPG, PNG, DOCX, and ZIP to specialized technical formats used by professional software and industries, our objective is to make file information easier to discover and understand.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            As the platform grows, we will continue adding file formats, guides, conversion tools, and other utilities.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Have an issue with information on AnyFileX, found an incorrect file-format detail, or want to report a problem with one of our tools?
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Contact the AnyFileX team through the contact options provided on the website.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>AnyFileX</strong><br />
            A Tanlytics digital product<br />
            Built by Tanveer Hussain
          </p>
        </div>
      </section>

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">Our Mission & Infrastructure</Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          Democratizing File Accessibility for Everyone
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          AnyFileX was founded to solve a universal headache: encountering an unknown digital file extension that refuses to open. Open any file in seconds with AnyFileX.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Searchable Formats" value="250+" subtitle="43 byte-signature profiles • 250+ indexed" icon={<Zap className="w-5 h-5" />} />
        <StatsCard label="Verified Guides" value="316" subtitle="Opening, repair & comparison manuals" icon={<Globe className="w-5 h-5" />} />
        <StatsCard label="In-Browser Tools" value="35+" subtitle="26 forensic tools • 9 converters" icon={<Server className="w-5 h-5" />} />
        <StatsCard label="Client Processing" value="100%" subtitle="Privacy via browser WebAssembly" icon={<Lock className="w-5 h-5" />} />
      </div>

      {/* Philosophy & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy-First Architecture</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike legacy conversion websites that require uploading sensitive personal documents to remote cloud servers, AnyFileX runs binary parsing and image re-encoding locally inside your browser memory using WebAssembly (WASM). Your photos, CAD blueprints, and documents never leave your device.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Speed & Precision</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By reading magic byte headers directly at the byte level, AnyFileX instantly identifies true file signatures even if the extension has been corrupted, omitted, or disguised.
          </p>
        </div>
      </div>

      {/* Platform Metrics Substantiation & Integrity Audit Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Substantiation & Transparency</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Platform Metrics Reconciliation & Audit
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate({ view: 'editorial-standards' } as any)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Editorial Standards
            </button>
            <button
              onClick={() => onNavigate({ view: 'authors' } as any)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Author Profiles
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          We maintain absolute transparency regarding all published data. To reconcile discrepancies that appear in historical marketing claims or uncurated third-party scraper indices, we publish the following verified methodology:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Extensions Indexing</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-xs">250+ cataloged</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Reconciliation:</strong> Claims of "50,000+ extensions" by automated scrapers count random strings, typos, and single-user temporary files. AnyFileX indexes exactly 250+ verified digital formats, anchored by 43 deep profiles with byte signatures and software specifications.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Published Guides</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-xs">316 verified</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Reconciliation:</strong> Rather than auto-generating 500+ thin articles, our editorial board has authored and peer-reviewed 316 comprehensive guides (254 opening walkthroughs, 32 format comparisons, 13 repair manuals, and 17 technical authority specifications).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Client-Side Tools</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-xs">35+ in-browser</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Reconciliation:</strong> Instead of listing 100+ trivial wrapper clones, AnyFileX provides 26 dedicated forensic analysis engines and 9 in-memory WebAssembly converters that run 100% locally with zero server uploads.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Community & Transparency</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-xs">Zero vanity metrics</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Reconciliation:</strong> We avoid unsubstantiated vanity subscriber counters (such as "25,000+ subscribers"). Our newsletter is a genuine, opt-in engineering digest distributed to developers, system administrators, and digital preservationists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
