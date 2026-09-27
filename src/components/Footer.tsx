'use client';

import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { AppRoute } from '../types';
import { routeToPath } from '../utils/router';
import { useLocale } from 'next-intl';
import { hasLocalizedContent, localizedPath } from '../i18n/paths';
import type { AppLocale } from '../i18n/routing';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onOpenSearch: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const locale = useLocale() as AppLocale;
  const copy = locale === 'nl' ? {
    skip: 'Voettekstnavigatie', description: 'Het universele platform voor digitale bestandsinformatie. Identificeer, open, converteer, herstel en begrijp elk digitaal bestandsformaat.', explore: 'Ontdekken', extensions: 'Bestandsextensies', guides: 'Handleidingen', open: 'Bestanden openen', software: 'Software', compare: 'Bestandsformaten vergelijken', converters: 'Converters', tools: 'Hulpmiddelen', company: 'Bedrijf', about: 'Over AnyFileX', contact: 'Contact', privacy: 'Privacybeleid', terms: 'Gebruiksvoorwaarden', slogan: 'Open elk bestand in seconden met AnyFileX. Alle rechten voorbehouden.', built: 'Met zorg gemaakt voor ervaren internetgebruikers',
  } : locale === 'es' ? {
    skip: 'Navegación del pie de página', description: 'La plataforma universal de información sobre archivos digitales. Identifica, abre, convierte, repara y comprende cualquier formato.', explore: 'Explorar', extensions: 'Extensiones', guides: 'Guías', open: 'Cómo abrir archivos', software: 'Software', compare: 'Comparar formatos', converters: 'Convertidores', tools: 'Herramientas', company: 'Empresa', about: 'Acerca de AnyFileX', contact: 'Contacto', privacy: 'Política de privacidad', terms: 'Términos y condiciones', slogan: 'Abre cualquier archivo en segundos con AnyFileX. Todos los derechos reservados.', built: 'Diseñado con precisión para usuarios avanzados de la web',
  } : {
    skip: 'Footer Navigation', description: 'The universal digital file intelligence platform. Identify, open, convert, repair, and understand any digital file extension instantly.', explore: 'Explore', extensions: 'File Extensions', guides: 'Guides', open: 'How to Open Files', software: 'Software', compare: 'Compare Formats', converters: 'Converters', tools: 'Tools', company: 'Company', about: 'About AnyFileX', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms & Conditions', slogan: 'Open Any File in Seconds with AnyFileX. All rights reserved.', built: 'Built with precision for web power users',
  };
  const renderAnchor = (
    route: AppRoute,
    className: string,
    children: React.ReactNode,
    id?: string,
    key?: React.Key
  ) => {
    const path = routeToPath(route);
    const href = hasLocalizedContent(path, locale) ? localizedPath(path, locale) : path;
    return (
      <a
        key={key}
        href={href}
        onClick={(e) => {
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            onNavigate(route);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">{copy.skip}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800 text-left">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 space-y-4 text-left">
            {renderAnchor(
              { view: 'home' },
              'flex items-center gap-2.5 group focus:outline-hidden cursor-pointer text-left',
              <>
                <div className="w-8 h-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105">
                  <span className="font-heading font-black text-lg text-white leading-none tracking-tight">X</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-heading">
                  AnyFile<span className="text-blue-400">X</span>
                </span>
              </>,
              'footer-logo-btn'
            )}
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed text-left">
              {copy.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                aria-label="X Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Primary links */}
          <div className="text-left">
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">{copy.explore}</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>{renderAnchor({ view: 'extensions' }, 'hover:text-blue-400 transition-colors', copy.extensions)}</li>
              <li>{renderAnchor({ view: 'guides' }, 'hover:text-blue-400 transition-colors', copy.guides)}</li>
              <li>{renderAnchor({ view: 'how-to-open' }, 'hover:text-blue-400 transition-colors', copy.open)}</li>
              <li>{renderAnchor({ view: 'software' }, 'hover:text-blue-400 transition-colors', copy.software)}</li>
              <li>{renderAnchor({ view: 'compare-hub' }, 'hover:text-blue-400 transition-colors', copy.compare)}</li>
              <li>{renderAnchor({ view: 'converters' }, 'hover:text-blue-400 transition-colors', copy.converters)}</li>
              <li>{renderAnchor({ view: 'tools' }, 'hover:text-blue-400 transition-colors', copy.tools)}</li>
            </ul>
          </div>

          {/* Company and legal links */}
          <div className="text-left">
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">{copy.company}</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>{renderAnchor({ view: 'about' }, 'hover:text-blue-400 transition-colors', copy.about)}</li>
              <li>{renderAnchor({ view: 'contact' }, 'hover:text-blue-400 transition-colors', copy.contact)}</li>
              <li>{renderAnchor({ view: 'privacy' }, 'hover:text-blue-400 transition-colors', copy.privacy)}</li>
              <li>{renderAnchor({ view: 'terms' }, 'hover:text-blue-400 transition-colors', copy.terms)}</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>© {new Date().getFullYear()} AnyFileX. {copy.slogan}</div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>{copy.built}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
