'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { routeToPath } from '../utils/router';
import { AppRoute } from '../types';

interface SmartLinkProps {
  route: AppRoute;
  className?: string;
  id?: string;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

/**
 * Crawlable navigation link. Renders a real <a href> (via next/link, so
 * client-side SPA navigation is preserved) with the locale prefix applied
 * when rendered under /es/ or /nl/.
 *
 * Use this for any UI element whose job is to navigate to a page that has a
 * URL. Genuine state changes (tabs, filters, accordions, copy buttons) stay
 * as <button>.
 */
export const SmartLink: React.FC<SmartLinkProps> = ({
  route,
  className,
  id,
  title,
  ariaLabel,
  children,
}) => {
  const locale = useLocale();
  const localePrefix = locale === 'es' || locale === 'nl' ? `/${locale}` : '';
  return (
    <Link
      href={`${localePrefix}${routeToPath(route)}`}
      className={className}
      id={id}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};

/**
 * Non-interactive twin of SmartLink for data entries that do not resolve to
 * a real page (e.g. a '*' wildcard or an unregistered slug). Keeps the visual
 * content without emitting a link target that would 404.
 */
export const DeadLink: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={className} aria-disabled="true">
    {children}
  </div>
);
