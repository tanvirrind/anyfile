'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { CommandPalette } from '../CommandPalette';
import { AppRoute } from '../../types';
import { parsePathToRoute, routeToPath } from '../../utils/router';
import { resolveThemePreference } from '../../lib/theme/themePreference';
import { usePathname, useRouter } from 'next/navigation';

interface AppLayoutClientProps {
  children: React.ReactNode;
}

export function AppLayoutClient({ children }: AppLayoutClientProps) {
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setCurrentRoute(parsePathToRoute(window.location.pathname, window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
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
