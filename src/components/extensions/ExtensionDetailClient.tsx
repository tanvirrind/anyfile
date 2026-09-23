'use client';

import React from 'react';
import { ExtensionDetailPage } from '../../views/ExtensionDetailPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';

interface ExtensionDetailClientProps {
  ext: string;
}

export function ExtensionDetailClient({ ext }: ExtensionDetailClientProps) {
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
  };

  return <ExtensionDetailPage ext={ext} onNavigate={handleNavigate} />;
}
