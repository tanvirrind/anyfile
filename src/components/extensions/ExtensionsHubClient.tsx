'use client';

import React from 'react';
import { ExtensionsPage } from '../../views/ExtensionsPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { hasLocalizedContent, localizedPath } from '../../i18n/paths';
import type { AppLocale } from '../../i18n/routing';

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
  const locale = useLocale() as AppLocale;
  const handleNavigate = (route: AppRoute) => {
    const routePath = routeToPath(route);
    const path = hasLocalizedContent(routePath, locale) ? localizedPath(routePath, locale) : routePath;
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
