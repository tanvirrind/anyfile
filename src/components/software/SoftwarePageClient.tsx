'use client';

import React from 'react';
import { SoftwarePage } from '../../views/SoftwarePage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';

interface SoftwarePageClientProps {
  softwareId?: string;
}

export function SoftwarePageClient({ softwareId }: SoftwarePageClientProps) {
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
  };

  return <SoftwarePage onNavigate={handleNavigate} selectedSoftwareId={softwareId} />;
}
