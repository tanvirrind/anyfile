import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { routing, type AppLocale } from './routing';

const messageLoaders: Record<AppLocale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../../messages/en.json'),
  nl: () => import('../../messages/nl.json'),
  es: () => import('../../messages/es.json'),
};

export default getRequestConfig(async () => {
  const localeHeader = (await headers()).get('x-next-intl-locale');
  const locale = routing.locales.includes(localeHeader as AppLocale) ? (localeHeader as AppLocale) : routing.defaultLocale;
  const messages = (await messageLoaders[locale]()).default;

  return { locale, messages };
});
