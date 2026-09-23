import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SocialProofSection } from './components/SocialProofSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PopularFileTypesGrid } from './components/PopularFileTypesGrid';
import { ToolsSection } from './components/ToolsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyUsComparisonSection } from './components/WhyUsComparisonSection';
import { LatestGuidesSection } from './components/LatestGuidesSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { SEOHead } from './components/SEOHead';
import { PageSkeleton } from './components/PageSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';

// Resilient code-splitting loader with retry for network hiccups or transient module fetching failures
function lazyWithRetry<P extends object = any>(
  factory: () => Promise<any>,
  namedExport?: string
): React.ComponentType<P> {
  return lazy(async () => {
    try {
      const module = await factory();
      const comp = module.default || (namedExport ? module[namedExport] : Object.values(module)[0]);
      return { default: comp };
    } catch (err) {
      console.warn('Dynamic import failed, retrying module fetch...', err);
      await new Promise(resolve => setTimeout(resolve, 300));
      try {
        const module = await factory();
        const comp = module.default || (namedExport ? module[namedExport] : Object.values(module)[0]);
        return { default: comp };
      } catch (retryErr) {
        console.error('Dynamic import retry failed:', retryErr);
        throw retryErr;
      }
    }
  }) as React.ComponentType<P>;
}

// Code-Split Dynamic Page Views for instant first render & reduced initial bundle
const ExtensionsPage = lazyWithRetry(() => import('./pages/ExtensionsPage'), 'ExtensionsPage');
const ExtensionDetailPage = lazyWithRetry(() => import('./pages/ExtensionDetailPage'), 'ExtensionDetailPage');
const SoftwarePage = lazyWithRetry(() => import('./pages/SoftwarePage'), 'SoftwarePage');
const ConvertersPage = lazyWithRetry(() => import('./pages/ConvertersPage'), 'ConvertersPage');
const TroubleshootHubPage = lazyWithRetry(() => import('./pages/TroubleshootHubPage'), 'TroubleshootHubPage');
const TroubleshootGuidePage = lazyWithRetry(() => import('./pages/TroubleshootGuidePage'), 'TroubleshootGuidePage');
const TechnicalHubPage = lazyWithRetry(() => import('./pages/TechnicalHubPage'), 'TechnicalHubPage');
const TechnicalGuidePage = lazyWithRetry(() => import('./pages/TechnicalGuidePage'), 'TechnicalGuidePage');
const ToolsPage = lazyWithRetry(() => import('./pages/ToolsPage'), 'ToolsPage');
const ToolDetailPage = lazyWithRetry(() => import('./pages/ToolDetailPage'), 'ToolDetailPage');
const FileAnalyzerPage = lazyWithRetry(() => import('./pages/FileAnalyzerPage'), 'FileAnalyzerPage');
const FileIdentifierPage = lazyWithRetry(() => import('./pages/FileIdentifierPage'), 'FileIdentifierPage');
const FileIdentifierResultPage = lazyWithRetry(() => import('./pages/FileIdentifierResultPage'), 'FileIdentifierResultPage');
const MetadataViewerPage = lazyWithRetry(() => import('./pages/MetadataViewerPage'), 'MetadataViewerPage');
const MetadataViewerResultPage = lazyWithRetry(() => import('./pages/MetadataViewerResultPage'), 'MetadataViewerResultPage');
const RemoveMetadataPage = lazyWithRetry(() => import('./pages/RemoveMetadataPage'), 'RemoveMetadataPage');
const HashGeneratorPage = lazyWithRetry(() => import('./pages/HashGeneratorPage'), 'HashGeneratorPage');
const ChecksumVerifierPage = lazyWithRetry(() => import('./pages/ChecksumVerifierPage'), 'ChecksumVerifierPage');
const MimeCheckerPage = lazyWithRetry(() => import('./pages/MimeCheckerPage'), 'MimeCheckerPage');
const MagicByteDetectorPage = lazyWithRetry(() => import('./pages/MagicByteDetectorPage'), 'MagicByteDetectorPage');
const MimeDetailPage = lazyWithRetry(() => import('./pages/MimeDetailPage'), 'MimeDetailPage');
const GuidesPage = lazyWithRetry(() => import('./pages/GuidesPage'), 'GuidesPage');
const BlogPage = lazyWithRetry(() => import('./pages/BlogPage'), 'BlogPage');
const CategoryPage = lazyWithRetry(() => import('./pages/CategoryPage'), 'CategoryPage');
const HowToOpenHubPage = lazyWithRetry(() => import('./pages/HowToOpenHubPage'), 'HowToOpenHubPage');
const HowToOpenPage = lazyWithRetry(() => import('./pages/HowToOpenPage'), 'HowToOpenPage');
const CompareHubPage = lazyWithRetry(() => import('./pages/CompareHubPage'), 'CompareHubPage');
const ComparisonPage = lazyWithRetry(() => import('./pages/ComparisonPage'), 'ComparisonPage');
const AdminCMSPage = lazyWithRetry(() => import('./pages/AdminCMSPage'), 'AdminCMSPage');
const AssistantPage = lazyWithRetry(() => import('./pages/AssistantPage'), 'AssistantPage');
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'), 'AboutPage');
const EditorialStandardsPage = lazyWithRetry(() => import('./pages/EditorialStandardsPage'), 'EditorialStandardsPage');
const AuthorsPage = lazyWithRetry(() => import('./pages/AuthorsPage'), 'AuthorsPage');
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'), 'ContactPage');
const SeoAuditPage = lazyWithRetry(() => import('./pages/SeoAuditPage'), 'SeoAuditPage');
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'), 'NotFoundPage');
const WorkflowPage = lazyWithRetry(() => import('./pages/WorkflowPage'), 'WorkflowPage');
const FormatHubView = lazyWithRetry(() => import('./components/content/FormatHubView'), 'FormatHubView');
const ContentDashboardPage = lazyWithRetry(() => import('./pages/ContentDashboardPage'), 'ContentDashboardPage');
const FormatGuidePage = lazyWithRetry(() => import('./pages/FormatGuidePage'), 'FormatGuidePage');
const AdminAuthGuard = lazyWithRetry(() => import('./components/admin/AdminAuthGuard'), 'AdminAuthGuard');

import { AppRoute } from './types';
import { parsePathToRoute, routeToPath } from './utils/router';

interface AppProps {
  initialRoute?: AppRoute;
}

export default function App({ initialRoute }: AppProps = {}) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (initialRoute) return initialRoute;
    if (typeof window !== 'undefined') {
      return parsePathToRoute(window.location.pathname, window.location.search);
    }
    return { view: 'home' };
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  // Sync Dark Mode class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Sync route with browser back/forward popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parsePathToRoute(window.location.pathname, window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: AppRoute) => {
    const targetPath = routeToPath(route);
    if (window.location.pathname + window.location.search !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExtensionFromHero = (extName: string) => {
    const cleanExt = extName.toLowerCase().replace('.', '');
    handleNavigate({ view: 'extension-detail', ext: cleanExt });
  };

  const handleDropFileFromHero = (file: File) => {
    setDroppedFile(file);
    if (currentRoute.view !== 'home') {
      handleNavigate({ view: 'home' });
    }
    setTimeout(() => {
      const toolsElem = document.getElementById('tools-section');
      if (toolsElem) {
        toolsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-600 selection:text-white">
      {/* Universal Header Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      {/* Main Page Router */}
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
          {currentRoute.view === 'home' && (
            <>
              <SEOHead
                title="AnyFileX – Open Any File in Seconds"
                description="Open Any File in Seconds with AnyFileX. Convert, repair, identify, and understand hundreds of file formats including HEIC, PDF, DOCX, ZIP, PSD, DWG, and more."
                canonicalPath="/"
                schemaData={{
                  '@context': 'https://schema.org',
                  '@type': 'WebApplication',
                  name: 'AnyFileX',
                  url: 'https://www.anyfilex.com/',
                  description: 'Open Any File in Seconds with AnyFileX. Convert, repair, identify, and understand any digital file format.',
                  applicationCategory: 'UtilitiesApplication',
                  operatingSystem: 'Windows, macOS, Linux, Android, iOS'
                }}
              />
              <HeroSection
                onSearchSubmit={handleSelectExtensionFromHero}
                onSelectExtension={handleSelectExtensionFromHero}
                onDropFile={handleDropFileFromHero}
                onNavigate={handleNavigate}
              />
              <SocialProofSection />
              <FeaturesSection onSelectFeatureTab={() => handleNavigate({ view: 'tools' })} />
              <PopularFileTypesGrid onSelectExtension={handleSelectExtensionFromHero} />
              <ToolsSection initialFile={droppedFile} />
              <HowItWorksSection />
              <WhyUsComparisonSection />
              <LatestGuidesSection onSelectGuide={(guide) => handleNavigate({ view: 'guide-detail', id: guide.id })} />
              <NewsletterSection />
            </>
          )}

          {currentRoute.view === 'extensions' && (
            <ExtensionsPage
              onNavigate={handleNavigate}
              initialCategory={currentRoute.categoryFilter}
              initialLetter={currentRoute.letterFilter}
              initialSearch={currentRoute.query}
            />
          )}

          {currentRoute.view === 'extension-detail' && (
            <ExtensionDetailPage ext={currentRoute.ext || 'heic'} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'how-to-open' && (
            currentRoute.ext ? (
              <HowToOpenPage ext={currentRoute.ext} onNavigate={handleNavigate} />
            ) : (
              <HowToOpenHubPage categoryFilter={currentRoute.categoryFilter} onNavigate={handleNavigate} />
            )
          )}

          {currentRoute.view === 'compare-hub' && (
            <CompareHubPage categoryFilter={currentRoute.categoryFilter} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'comparison-detail' && (
            <ComparisonPage slug={currentRoute.slug || 'heic-vs-jpg'} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'software' && (
            <SoftwarePage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'software-detail' && (
            <SoftwarePage onNavigate={handleNavigate} selectedSoftwareId={currentRoute.id} />
          )}

          {currentRoute.view === 'converters' && (
            <ConvertersPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'converter-detail' && (
            <ConvertersPage onNavigate={handleNavigate} selectedConverterId={currentRoute.id} />
          )}

          {(currentRoute.view === 'repair' || currentRoute.view === 'troubleshoot-hub') && (
            <TroubleshootHubPage
              onNavigate={handleNavigate}
              categoryFilter={(currentRoute as any).categoryFilter}
            />
          )}

          {(currentRoute.view === 'repair-detail' || currentRoute.view === 'troubleshoot-guide') && (
            <TroubleshootGuidePage
              slug={(currentRoute as any).slug || (currentRoute as any).id || 'why-wont-my-file-open'}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute.view === 'security-hub' && (
            <TechnicalHubPage
              categoryFilter={currentRoute.categoryFilter}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute.view === 'technical-guide' && (
            <TechnicalGuidePage
              slug={currentRoute.slug || 'what-are-magic-bytes'}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute.view === 'tools' && (
            <ToolsPage
              onNavigate={handleNavigate}
              selectedCategory={currentRoute.categoryFilter}
              selectedToolId={currentRoute.toolId}
            />
          )}

          {currentRoute.view === 'tool-detail' && (
            <ToolDetailPage toolSlug={currentRoute.slug} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'file-analyzer' && (
            <FileAnalyzerPage initialReportId={currentRoute.id} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'file-identifier' && (
            <FileAnalyzerPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'file-identifier-result' && (
            <FileAnalyzerPage initialReportId={currentRoute.id} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'metadata-viewer' && (
            <MetadataViewerPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'metadata-result' && (
            <MetadataViewerResultPage reportId={currentRoute.id} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'remove-metadata' && (
            <RemoveMetadataPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'hash-generator' && (
            <HashGeneratorPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'checksum-verifier' && (
            <ChecksumVerifierPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'mime-checker' && (
            <MimeCheckerPage onNavigate={handleNavigate} initialQuery={currentRoute.query} />
          )}

          {currentRoute.view === 'magic-byte-detector' && (
            <MagicByteDetectorPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'mime-detail' && (
            <MimeDetailPage onNavigate={handleNavigate} mimeSlug={currentRoute.mimeSlug || 'image-heic'} />
          )}

          {(currentRoute.view === 'guides' || currentRoute.view === 'resources') && (
            <GuidesPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'guide-detail' && (
            <GuidesPage onNavigate={handleNavigate} selectedGuideId={currentRoute.id} />
          )}

          {currentRoute.view === 'blog' && (
            <BlogPage onNavigate={handleNavigate} />
          )}

          {(currentRoute.view === 'blog-post' || currentRoute.view === 'blog-detail') && (
            <BlogPage onNavigate={handleNavigate} selectedPostId={currentRoute.id} />
          )}

          {currentRoute.view === 'category-detail' && (
            <CategoryPage categoryId={currentRoute.id || 'images'} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'admin' && (
            <AdminAuthGuard onNavigate={handleNavigate} currentRoute={currentRoute}>
              <AdminCMSPage onNavigate={handleNavigate} />
            </AdminAuthGuard>
          )}

          {currentRoute.view === 'assistant' && (
            <AssistantPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'editorial-standards' && (
            <EditorialStandardsPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'authors' && (
            <AuthorsPage onNavigate={handleNavigate} selectedAuthorId={currentRoute.authorId} />
          )}

          {currentRoute.view === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'workflows' && (
            <WorkflowPage initialWorkflowId={currentRoute.workflowId} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'format-guide' && (
            <FormatGuidePage format={currentRoute.format} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'content-hub' && (
            <FormatHubView topic={currentRoute.topic} onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'content-dashboard' && (
            <AdminAuthGuard onNavigate={handleNavigate} currentRoute={currentRoute}>
              <ContentDashboardPage onNavigate={handleNavigate} />
            </AdminAuthGuard>
          )}

          {(currentRoute.view === 'seo-audit' || currentRoute.view === 'sitemaps') && (
            <SeoAuditPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'not-found' && (
            <NotFoundPage onNavigate={handleNavigate} requestedPath={currentRoute.requestedPath} />
          )}
        </Suspense>
      </ErrorBoundary>
    </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} onOpenSearch={() => setCommandPaletteOpen(true)} />

      {/* Universal Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
