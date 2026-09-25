import { describe, it, expect } from 'vitest';
import { resolveThemePreference } from '../../src/lib/theme/themePreference';

describe('Next.js theme preference resolution', () => {
  it.each([
    ['dark', false, 'dark'],
    ['light', true, 'light'],
    [null, true, 'dark'],
    [null, false, 'light'],
    ['unknown', true, 'dark'],
    ['unknown', false, 'light'],
  ])('resolves stored=%s and systemDark=%s to %s', (stored, systemDark, expected) => {
    expect(resolveThemePreference(stored, systemDark)).toBe(expected);
  });
});
