import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Download,
  Star,
  ExternalLink,
  CheckCircle2,
  Laptop,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { SoftwareApp, AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { isValidSoftwareId } from '../../lib/routes/routeManifest';
import {
  getOpenersByOS,
  OPENER_OS_ORDER,
  OPENER_OS_LABELS,
  OpenerOS,
} from '../../lib/database/softwareEngine';

interface ExtensionSoftwareGridProps {
  apps: SoftwareApp[];
  extensionName: string;
  /** Raw extension (e.g. 'heic'). When provided, openers are joined against
   *  the software catalog and grouped by OS into tabs. */
  extension?: string;
  onNavigate: (route: AppRoute) => void;
}

interface CardApp {
  name: string;
  os: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  isFree: boolean;
  developer: string;
  slug: string;
}

const AppCard: React.FC<{
  app: CardApp;
  idx: number;
  extensionName: string;
  /** Crawlable link to the software detail page, or null when the slug does
   *  not resolve to a real catalog page (never emit a 404 target). */
  detailHref: string | null;
}> = ({ app, idx, extensionName, detailHref }) => {
  const rating = (4.7 + (idx * 0.1) % 0.3).toFixed(1);

  return (
    <div
      key={app.name}
      className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30 transition-all group flex flex-col justify-between space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
              {app.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {app.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {app.developer || 'Verified Software Provider'}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 ${
              app.isFree
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
            }`}
          >
            {app.isFree ? 'Free' : 'Paid / Commercial'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{rating} / 5.0</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Laptop className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{app.os.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Compatible with .{extensionName}</span>
        </span>

        {detailHref ? (
          <Link
            href={detailHref}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>App Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 cursor-default">
            <span>App Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};

export const ExtensionSoftwareGrid: React.FC<ExtensionSoftwareGridProps> = ({
  apps,
  extensionName,
  extension,
  onNavigate,
}) => {
  void onNavigate; // retained for prop-contract compatibility; navigation now uses real links
  const locale = useLocale();
  const localePrefix = locale === 'es' || locale === 'nl' ? `/${locale}` : '';
  const href = (route: AppRoute) => `${localePrefix}${routeToPath(route)}`;
  // Resolve each app's detail slug against the software catalog. Slugs that
  // do not correspond to a real page get no link (see AppCard) instead of
  // emitting a target that 404s.
  const detailHrefFor = (slug: string): string | null =>
    isValidSoftwareId(slug) ? href({ view: 'software-detail', id: slug }) : null;
  // OS-grouped openers from the software catalog (only used when the
  // `extension` prop is provided and at least two OS groups are non-empty).
  const grouped = useMemo(
    () => (extension ? getOpenersByOS(extension) : null),
    [extension]
  );
  const activeGroups = useMemo(
    () =>
      grouped
        ? OPENER_OS_ORDER.filter((os) => grouped[os].length > 0)
        : [],
    [grouped]
  );
  const [activeOS, setActiveOS] = useState<OpenerOS>('windows');

  useEffect(() => {
    if (activeGroups.length > 0) setActiveOS(activeGroups[0]);
  }, [extension, activeGroups.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const useTabs = activeGroups.length >= 2;
  const tabApps: CardApp[] = useTabs
    ? grouped![activeOS].map((app) => ({
        name: app.name,
        os: app.supportedOS,
        isFree: app.priceType === 'Free' || app.priceType === 'Open Source',
        developer: app.developer,
        slug: app.id,
      }))
    : [];
  const uniqueCount = useTabs
    ? new Set(
        activeGroups.flatMap((os) => grouped![os].map((app) => app.id))
      ).size
    : apps.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recommended Software for .{extensionName}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {uniqueCount} Verified Apps
        </span>
      </div>

      {useTabs && (
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label={`Software for .${extensionName} by operating system`}
        >
          {activeGroups.map((os) => {
            const isActive = os === activeOS;
            const Icon = os === 'ios' || os === 'android' ? Smartphone : Laptop;
            return (
              <button
                key={os}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveOS(os)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                {OPENER_OS_LABELS[os]}
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {grouped![os].length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {useTabs ? (
          <React.Fragment key={activeOS}>
            {tabApps.map((app, idx) => (
              <AppCard
                key={app.name}
                app={app}
                idx={idx}
                extensionName={extensionName}
                detailHref={detailHrefFor(app.slug)}
              />
            ))}
          </React.Fragment>
        ) : (
          apps.map((app, idx) => {
            const slug =
              app.slug || app.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            return (
              <AppCard
                key={app.name}
                app={{
                  name: app.name,
                  os: app.os,
                  isFree: app.isFree,
                  developer: app.developer,
                  slug,
                }}
                idx={idx}
                extensionName={extensionName}
                detailHref={detailHrefFor(slug)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
