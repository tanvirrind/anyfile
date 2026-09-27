import { getLocale } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';

export async function getRequestLocale(): Promise<AppLocale> {
  try {
    return (await getLocale()) as AppLocale;
  } catch {
    // Keeps pure metadata unit tests deterministic when they run outside Next's request context.
    return 'en';
  }
}

