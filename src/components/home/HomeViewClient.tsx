'use client';

import React from 'react';
import { HeroSection } from '../HeroSection';
import { SocialProofSection } from '../SocialProofSection';
import { FeaturesSection } from '../FeaturesSection';
import { PopularFileTypesGrid } from '../PopularFileTypesGrid';
import { ToolsSection } from '../ToolsSection';
import { HowItWorksSection } from '../HowItWorksSection';
import { WhyUsComparisonSection } from '../WhyUsComparisonSection';
import { LatestGuidesSection } from '../LatestGuidesSection';
import { NewsletterSection } from '../NewsletterSection';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { useRouter } from 'next/navigation';
import { setPendingFile } from '../../lib/fileTransferStore';
import { useLocale } from 'next-intl';
import type { AppLocale } from '../../i18n/routing';
import { localizedPath } from '../../i18n/paths';

export function HomeViewClient() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    router.push(locale === 'en' ? path : localizedPath(path, locale));
    window.scrollTo(0, 0);
  };

  const handleSelectExtension = (ext: string) => {
    handleNavigate({ view: 'extension-detail', ext: ext.toLowerCase() });
  };

  const handleSearchSubmit = (query: string) => {
    handleNavigate({ view: 'extensions', query });
  };

  const handleDropFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext) {
      setPendingFile(file);
      handleNavigate({ view: 'extension-detail', ext });
    }
  };

  return (
    <>
      <HeroSection
        onSearchSubmit={handleSearchSubmit}
        onSelectExtension={handleSelectExtension}
        onDropFile={handleDropFile}
        onNavigate={handleNavigate}
      />
      <SocialProofSection />
      <FeaturesSection />
      <PopularFileTypesGrid onSelectExtension={handleSelectExtension} />
      <ToolsSection />
      <HowItWorksSection />
      <WhyUsComparisonSection />
      <LatestGuidesSection onSelectGuide={(guide) => handleNavigate({ view: 'guide-detail', id: guide.id })} />
      <NewsletterSection />
    </>
  );
}
