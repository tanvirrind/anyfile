'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { CommandPalette } from '../CommandPalette';
import { AppRoute } from '../../types';
import { parsePathToRoute, routeToPath } from '../../utils/router';
import { resolveThemePreference } from '../../lib/theme/themePreference';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { hasLocalizedContent, localizedPath } from '../../i18n/paths';
import type { AppLocale } from '../../i18n/routing';

interface AppLayoutClientProps {
  children: React.ReactNode;
}

export function AppLayoutClient({ children }: AppLayoutClientProps) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  // Keep the server and first client render identical. Browser theme
  // preferences are read after hydration to avoid mismatching the Navbar.
  const [darkMode, setDarkMode] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  // Keep the initial server and client render identical. The pathname is
  // applied in the effect below after hydration, which prevents active-nav
  // classes from changing between SSR and the first client render.
  const [currentRoute, setCurrentRoute] = useState<AppRoute>({ view: 'home' });

  useEffect(() => {
    if (pathname) {
      setCurrentRoute(parsePathToRoute(pathname, typeof window === 'undefined' ? '' : window.location.search));
    }
  }, [pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(resolveThemePreference(savedTheme, window.matchMedia('(prefers-color-scheme: dark)').matches) === 'dark');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // A small last-mile guard for legacy view modules and generated data that
  // still contain shared English UI labels. Content-specific technical names
  // are intentionally preserved; only stable interface phrases are mapped.
  useEffect(() => {
    if (locale !== 'es' || typeof document === 'undefined') return;
    const replacements: Array<[RegExp, string]> = [
      [/Frequently Asked Questions/g, 'Preguntas frecuentes'],
      [/Troubleshooting Guide/g, 'Guía de solución de problemas'],
      [/Troubleshooting/g, 'Solución de problemas'],
      [/Technical Specifications/g, 'Especificaciones técnicas'],
      [/How to Open Any File/g, 'Cómo abrir cualquier archivo'],
      [/Select Files/g, 'Seleccionar archivos'],
      [/Privacy Policy/g, 'Política de privacidad'],
      [/Terms of Service/g, 'Términos de servicio'],
      [/Contact AnyFileX/g, 'Contactar con AnyFileX'],
      [/\bExplore\b/g, 'Explorar'],
    ];
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let current: Node | null;
      while ((current = walker.nextNode())) nodes.push(current as Text);
      for (const node of nodes) {
        if (!node.nodeValue || node.parentElement?.closest('script,style,noscript')) continue;
        const translated = replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), node.nodeValue);
        if (translated !== node.nodeValue) node.nodeValue = translated;
      }
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setCurrentRoute(parsePathToRoute(window.location.pathname, window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: AppRoute) => {
    const routePath = routeToPath(route);
    const path = hasLocalizedContent(routePath, locale) ? localizedPath(routePath, locale) : routePath;
    router.push(path);
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer onNavigate={handleNavigate} onOpenSearch={() => setSearchOpen(true)} />

      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
