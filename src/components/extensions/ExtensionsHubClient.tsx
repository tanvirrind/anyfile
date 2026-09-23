'use client';

import React from 'react';
import { ExtensionsPage } from '../../views/ExtensionsPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';

interface ExtensionsHubClientProps {
  initialSearch?: string;
  initialCategory?: string;
  initialLetter?: string;
}

export function ExtensionsHubClient({
  initialSearch,
  initialCategory,
  initialLetter,
}: ExtensionsHubClientProps) {
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
  };

  return (
    <ExtensionsPage
      onNavigate={handleNavigate}
      initialSearch={initialSearch}
      initialCategory={initialCategory}
      initialLetter={initialLetter}
    />
  );
}
