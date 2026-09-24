'use client';

import React from 'react';
import { ExtensionsPage } from '../../views/ExtensionsPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    router.push(path);
    window.scrollTo(0, 0);
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
