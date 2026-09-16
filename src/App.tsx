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

// Code-Split Dynamic Page Views for instant first render & reduced initial bundle
const ExtensionsPage = lazy(() => import('./pages/ExtensionsPage').then(m => ({ default: m.ExtensionsPage })));
const ExtensionDetailPage = lazy(() => import('./pages/ExtensionDetailPage').then(m => ({ default: m.ExtensionDetailPage })));
const SoftwarePage = lazy(() => import('./pages/SoftwarePage').then(m => ({ default: m.SoftwarePage })));
const ConvertersPage = lazy(() => import('./pages/ConvertersPage').then(m => ({ default: m.ConvertersPage })));
const TroubleshootHubPage = lazy(() => import('./pages/TroubleshootHubPage').then(m => ({ default: m.TroubleshootHubPage })));
const TroubleshootGuidePage = lazy(() => import('./pages/TroubleshootGuidePage').then(m => ({ default: m.TroubleshootGuidePage })));
const TechnicalHubPage = lazy(() => import('./pages/TechnicalHubPage').then(m => ({ default: m.TechnicalHubPage })));
const TechnicalGuidePage = lazy(() => import('./pages/TechnicalGuidePage').then(m => ({ default: m.TechnicalGuidePage })));
const ToolsPage = lazy(() => import('./pages/ToolsPage').then(m => ({ default: m.ToolsPage })));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage').then(m => ({ default: m.ToolDetailPage })));
const FileAnalyzerPage = lazy(() => import('./pages/FileAnalyzerPage').then(m => ({ default: m.FileAnalyzerPage })));
const FileIdentifierPage = lazy(() => import('./pages/FileIdentifierPage').then(m => ({ default: m.FileIdentifierPage })));
const FileIdentifierResultPage = lazy(() => import('./pages/FileIdentifierResultPage').then(m => ({ default: m.FileIdentifierResultPage })));
const MetadataViewerPage = lazy(() => import('./pages/MetadataViewerPage').then(m => ({ default: m.MetadataViewerPage })));
const MetadataViewerResultPage = lazy(() => import('./pages/MetadataViewerResultPage').then(m => ({ default: m.MetadataViewerResultPage })));
const RemoveMetadataPage = lazy(() => import('./pages/RemoveMetadataPage').then(m => ({ default: m.RemoveMetadataPage })));
const HashGeneratorPage = lazy(() => import('./pages/HashGeneratorPage').then(m => ({ default: m.HashGeneratorPage })));
const ChecksumVerifierPage = lazy(() => import('./pages/ChecksumVerifierPage').then(m => ({ default: m.ChecksumVerifierPage })));
const MimeCheckerPage = lazy(() => import('./pages/MimeCheckerPage').then(m => ({ default: m.MimeCheckerPage })));
const MagicByteDetectorPage = lazy(() => import('./pages/MagicByteDetectorPage').then(m => ({ default: m.MagicByteDetectorPage })));
const MimeDetailPage = lazy(() => import('./pages/MimeDetailPage').then(m => ({ default: m.MimeDetailPage })));
const GuidesPage = lazy(() => import('./pages/GuidesPage').then(m => ({ default: m.GuidesPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const HowToOpenHubPage = lazy(() => import('./pages/HowToOpenHubPage').then(m => ({ default: m.HowToOpenHubPage })));
const HowToOpenPage = lazy(() => import('./pages/HowToOpenPage').then(m => ({ default: m.HowToOpenPage })));
const CompareHubPage = lazy(() => import('./pages/CompareHubPage').then(m => ({ default: m.CompareHubPage })));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage').then(m => ({ default: m.ComparisonPage })));
const AdminCMSPage = lazy(() => import('./pages/AdminCMSPage').then(m => ({ default: m.AdminCMSPage })));
const AssistantPage = lazy(() => import('./pages/AssistantPage').then(m => ({ default: m.AssistantPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const SeoAuditPage = lazy(() => import('./pages/SeoAuditPage').then(m => ({ default: m.SeoAuditPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const WorkflowPage = lazy(() => import('./pages/WorkflowPage').then(m => ({ default: m.WorkflowPage })));
const FormatHubView = lazy(() => import('./components/content/FormatHubView').then(m => ({ default: m.FormatHubView })));
const ContentDashboardPage = lazy(() => import('./pages/ContentDashboardPage').then(m => ({ default: m.ContentDashboardPage })));
const FormatGuidePage = lazy(() => import('./pages/FormatGuidePage').then(m => ({ default: m.FormatGuidePage })));

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
        <Suspense fallback={<PageSkeleton />}>
          {currentRoute.view === 'home' && (
            <>
              <SEOHead
                title="AnyFileX – Open Any File in Seconds with AnyFileX.com"
                description="Open Any File in Seconds with AnyFileX.com. Convert, repair, identify, and understand thousands of file formats including HEIC, PDF, DOCX, ZIP, PSD, DWG, and more."
                canonicalPath="/"
                schemaData={{
                  '@context': 'https://schema.org',
                  '@type': 'WebApplication',
                  name: 'AnyFileX',
                  url: 'https://anyfilex.com',
                  description: 'Open Any File in Seconds with AnyFileX.com. Convert, repair, identify, and understand any digital file format.',
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
            <AdminCMSPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'assistant' && (
            <AssistantPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
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
            <ContentDashboardPage onNavigate={handleNavigate} />
          )}

          {(currentRoute.view === 'seo-audit' || currentRoute.view === 'sitemaps') && (
            <SeoAuditPage onNavigate={handleNavigate} />
          )}

          {currentRoute.view === 'not-found' && (
            <NotFoundPage onNavigate={handleNavigate} requestedPath={currentRoute.requestedPath} />
          )}
        </Suspense>
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
