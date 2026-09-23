'use client';

import React from 'react';
import { NotFoundPage } from '../../views/NotFoundPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';

export function NotFoundClient() {
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
  };

  return <NotFoundPage onNavigate={handleNavigate} />;
}
