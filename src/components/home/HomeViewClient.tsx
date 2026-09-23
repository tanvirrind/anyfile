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

export function HomeViewClient() {
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
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
