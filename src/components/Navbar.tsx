'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  FileSearch,
  FileText,
  ShieldOff,
  Hash,
  CheckCircle2,
  Code2,
  Cpu,
  RefreshCw,
  Wrench,
  Grid,
  Sliders,
  Maximize
} from 'lucide-react';
import { AppRoute } from '../types';
import { routeToPath } from '../utils/router';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSearch: () => void;
  onNavigate: (route: AppRoute) => void;
  currentRoute: AppRoute;
}

interface ToolMenuItem {
  label: string;
  desc: string;
  route: AppRoute;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenSearch,
  onNavigate,
  currentRoute,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subTools: ToolMenuItem[] = [
    {
      label: 'Smart Pipelines',
      desc: 'Visual multi-step file pipelines & batch processing',
      route: { view: 'workflows' },
      icon: Sliders,
    },
    {
      label: 'Image Compressor',
      desc: 'Compress JPG, PNG & WEBP with live metrics',
      route: { view: 'tool-detail', slug: 'image-compressor' } as any,
      icon: Sliders,
    },
    {
      label: 'Image Resizer',
      desc: 'Scale dimensions with aspect ratio lock',
      route: { view: 'tool-detail', slug: 'image-resizer' } as any,
      icon: Maximize,
    },
    {
      label: 'File Analyzer',
      desc: 'Inspect binary headers & identify true format',
      route: { view: 'file-analyzer' },
      icon: Cpu,
    },
    {
      label: 'File Identifier',
      desc: 'Detect unknown file formats instantly',
      route: { view: 'file-identifier' },
      icon: FileSearch,
    },
    {
      label: 'Metadata Inspector',
      desc: 'Inspect EXIF, ID3, PDF & video tags',
      route: { view: 'metadata-viewer' },
      icon: FileText,
    },
    {
      label: 'Metadata Cleaner',
      desc: 'Strip GPS location & privacy metadata',
      route: { view: 'remove-metadata' },
      icon: ShieldOff,
    },
    {
      label: 'Hash Generator',
      desc: 'Generate SHA-256, MD5, SHA-1 hashes',
      route: { view: 'hash-generator' },
      icon: Hash,
    },
    {
      label: 'Checksum Verifier',
      desc: 'Validate file integrity & verify target hashes',
      route: { view: 'checksum-verifier' },
      icon: CheckCircle2,
    },
    {
      label: 'MIME Type Checker',
      desc: 'Lookup Content-Type headers & RFC specs',
      route: { view: 'mime-checker' },
      icon: Code2,
    },
    {
      label: 'Magic Byte Detector',
      desc: 'Analyze binary headers & detect spoofing',
      route: { view: 'magic-byte-detector' },
      icon: Cpu,
    },
    {
      label: 'File Converters',
      desc: 'Convert images, documents & media online',
      route: { view: 'converters' },
      icon: RefreshCw,
    },
    {
      label: 'Troubleshoot & Fix',
      desc: 'Diagnose why files won\'t open & fix errors',
      route: { view: 'repair' },
      icon: Wrench,
    },
    {
      label: 'Security & Tech Authority',
      desc: 'How digital files work: magic bytes, entropy, SHA-256, spoofing',
      route: { view: 'security-hub' } as any,
      icon: ShieldOff,
    },
    {
      label: 'All Tools Overview',
      desc: 'Browse complete catalog of file utilities',
      route: { view: 'tools' },
      icon: Grid,
    },
  ];

  const mainNavLinks: { label: string; route: AppRoute; badge?: string }[] = [
    { label: 'Extensions', route: { view: 'extensions' } },
    { label: 'How to Open', route: { view: 'how-to-open' } },
    { label: 'Compare', route: { view: 'compare-hub' } },
    { label: 'Troubleshoot', route: { view: 'repair' } },
    { label: 'Software', route: { view: 'software' } },
    { label: 'Guides', route: { view: 'guides' } },
  ];

  const toolViews = [
    'workflows',
    'tools',
    'file-analyzer',
    'file-identifier',
    'file-identifier-result',
    'metadata-viewer',
    'metadata-result',
    'remove-metadata',
    'hash-generator',
    'checksum-verifier',
    'mime-checker',
    'magic-byte-detector',
    'converters',
    'converter-detail',
    'repair',
    'repair-detail',
    'troubleshoot-hub',
    'troubleshoot-guide',
    'security-hub',
    'technical-guide',
  ];

  const isToolActive = toolViews.includes(currentRoute.view);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (route: AppRoute) => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setToolsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setToolsDropdownOpen(false);
    }, 150);
  };

  const renderAnchor = (
    route: AppRoute,
    className: string,
    children: React.ReactNode,
    id?: string,
    key?: React.Key
  ) => {
    const href = routeToPath(route);
    return (
      <a
        key={key}
        href={href}
        onClick={(e) => {
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            handleNavClick(route);
          }
        }}
        className={className}
        id={id}
      >
        {children}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Main Nav Group */}
        <div className="flex items-center gap-8">
          {renderAnchor(
            { view: 'home' },
            'flex items-center gap-2.5 group focus:outline-hidden cursor-pointer',
            <>
              <div className="w-8 h-8 bg-slate-950 dark:bg-black border border-slate-800 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
                <span className="font-heading font-black text-lg text-white leading-none tracking-tight">X</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                AnyFile<span className="text-blue-600 dark:text-blue-400">X</span>
              </span>
            </>,
            'navbar-logo-btn'
          )}

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Tools Dropdown Trigger */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`text-sm font-medium flex items-center gap-1 py-2 transition-colors cursor-pointer ${
                  isToolActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
                }`}
                aria-expanded={toolsDropdownOpen}
                id="nav-dropdown-tools-btn"
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Tools Mega Dropdown Menu */}
              {toolsDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-80 sm:w-[520px] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Developer & File Utilities
                      </span>
                      {renderAnchor(
                        { view: 'tools' },
                        'text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer',
                        <>
                          <span>View All Tools</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-2">
                      {subTools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = currentRoute.view === tool.route.view;
                        return renderAnchor(
                          tool.route,
                          `p-2.5 rounded-xl text-left flex items-start gap-3 transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                          }`,
                          <>
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs font-bold leading-tight truncate">
                                {tool.label}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">
                                {tool.desc}
                              </p>
                            </div>
                          </>,
                          undefined,
                          tool.label
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Top Nav Links */}
            {mainNavLinks.map((link) => {
              const isActive = currentRoute.view === link.route.view;
              return renderAnchor(
                link.route,
                `text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
                }`,
                <>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-2xs">
                      {link.badge}
                    </span>
                  )}
                </>,
                `nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`,
                link.label
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Command Palette Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            id="navbar-cmd-k-btn"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search extensions...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border rounded text-slate-400">
              Ctrl K
            </kbd>
          </button>

          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Search extensions"
            id="navbar-mobile-search-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
            aria-label={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="dark-mode-toggle-btn"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Toggle Navigation Menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-xl">
          {/* Mobile Dark / Light Theme Toggle Row */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              <span>Appearance ({darkMode ? 'Dark' : 'Light'})</span>
            </span>
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              id="mobile-theme-toggle-btn"
            >
              Toggle to {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Mobile Tools Accordion Header */}
          <div className="space-y-2">
            <button
              onClick={() => setMobileToolsExpanded(!mobileToolsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Tools & Utilities</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileToolsExpanded ? 'rotate-180 text-blue-600' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Mobile Sub Tools List */}
            {mobileToolsExpanded && (
              <div className="pl-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 my-1">
                {subTools.map((tool) => {
                  const Icon = tool.icon;
                  return renderAnchor(
                    tool.route,
                    'w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between cursor-pointer',
                    <>
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-blue-500" />
                        <span>{tool.label}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </>,
                    undefined,
                    `mobile-tool-${tool.label}`
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Links in Mobile Nav */}
          {mainNavLinks.map((link) =>
            renderAnchor(
              link.route,
              'w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer',
              <>
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </>,
              undefined,
              `mobile-nav-${link.label}`
            )
          )}
        </div>
      )}
    </header>
  );
};

