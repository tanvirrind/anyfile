export type ThemePreference = 'dark' | 'light';

export function resolveThemePreference(storedTheme: string | null, prefersDark: boolean): ThemePreference {
  if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
  return prefersDark ? 'dark' : 'light';
}
