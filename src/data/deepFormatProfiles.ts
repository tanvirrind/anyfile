import { DeepFormatProfile } from './deepProfiles/types';
import { DWG_DEEP_PROFILE } from './deepProfiles/dwg';

export type { DeepFormatProfile, DeepProfileSection, DeepProfileFaq } from './deepProfiles/types';

/**
 * Registry of deep, long-form content profiles, keyed by lowercase file extension.
 *
 * Formats without an entry keep using the generated page exactly as before, so
 * adding a profile is purely additive. Profiles are written for high-value keyword
 * clusters where the generated template would otherwise be too thin to compete.
 */
export const DEEP_FORMAT_PROFILES: Record<string, DeepFormatProfile> = {
  dwg: DWG_DEEP_PROFILE,
};

/** Looks up a deep profile by extension, tolerating a leading dot and any casing. */
export function getDeepFormatProfile(ext: string | undefined): DeepFormatProfile | undefined {
  if (!ext) return undefined;
  return DEEP_FORMAT_PROFILES[ext.trim().replace(/^\./, '').toLowerCase()];
}
