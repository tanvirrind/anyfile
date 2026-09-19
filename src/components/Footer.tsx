import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { AppRoute } from '../types';
import { routeToPath } from '../utils/router';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onOpenSearch: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800 text-left">
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
              The universal digital file intelligence platform. Identify, open, convert, repair, and understand any digital file extension instantly.
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

          {/* Links Column 1: Extensions */}
          <div className="text-left">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4 text-left">Popular Extensions</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 text-left">
              {['HEIC', 'PSD', 'DWG', 'STEP', 'EML', 'DAT', 'PDF', 'WEBP', 'ZIP'].map((ext) => (
                <li key={ext} className="text-left">
                  {renderAnchor(
                    { view: 'extension-detail', ext },
                    'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug',
                    `.${ext} Format Guide`
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Tools & Converters */}
          <div className="text-left">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4 text-left">Tools & Utilities</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 text-left">
              <li className="text-left">
                {renderAnchor({ view: 'file-identifier' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Magic Byte Identifier Engine')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'metadata-viewer' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'EXIF & File Metadata Viewer')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'remove-metadata' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Remove Metadata Privacy Guide')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'hash-generator' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'File Hash Generator (MD5 / SHA256)')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'checksum-verifier' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Checksum Verifier')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'mime-checker' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'MIME Type Checker')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'magic-byte-detector' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Magic Byte Detector')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'converters' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Online File Converters')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'repair' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Troubleshoot & Problem Hub')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'repair-detail', id: 'why-wont-my-file-open' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', "Why Won't My File Open?")}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'repair-detail', id: 'fix-file-wrong-extension' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Fix Wrong File Extension')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'tools', toolId: 'hash' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'SHA-256 Checksum Verifier')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'tools', toolId: 'size-calc' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'File Size Calculator')}
              </li>
            </ul>
          </div>

          {/* Links Column 3: Format Guides & Technical Authority */}
          <div className="text-left">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4 text-left">Format Guides & Authority</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 text-left">
              <li className="text-left">
                {renderAnchor({ view: 'security-hub' } as any, 'text-left block w-full hover:text-blue-400 font-semibold text-blue-300 transition-colors cursor-pointer leading-snug', '🛡️ Security & Authority Center')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'technical-guide', slug: 'what-are-magic-bytes' } as any, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'What Are Magic Bytes?')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'technical-guide', slug: 'what-is-file-entropy' } as any, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'What Is File Entropy?')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'technical-guide', slug: 'what-is-sha-256' } as any, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'What Is SHA-256?')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'technical-guide', slug: 'what-is-a-zip-bomb' } as any, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'What Is a ZIP Bomb?')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'technical-guide', slug: 'how-file-extensions-can-be-spoofed' } as any, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'How Extensions Are Spoofed')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'format-guide', format: 'heic' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'What Is a HEIC File?')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'format-guide', format: 'webp' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'What Is a WEBP File?')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'how-to-open' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'How to Open Any File')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'compare-hub' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Compare File Formats')}
              </li>
            </ul>
          </div>

          {/* Links Column 4: Navigation & Company */}
          <div className="text-left">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4 text-left">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 text-left">
              <li className="text-left">
                {renderAnchor({ view: 'extensions' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'All Extensions Directory')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'guides' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Educational Guides Hub')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'content-hub', topic: 'heic' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'HEIC Topic Authority Hub')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'editorial-standards' } as any, 'text-left block w-full hover:text-blue-400 font-medium text-emerald-400 transition-colors cursor-pointer leading-snug', '📋 Editorial Standards & Policy')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'authors' } as any, 'text-left block w-full hover:text-blue-400 font-medium text-blue-300 transition-colors cursor-pointer leading-snug', '👥 Author Profiles & Reviewers')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'blog' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Engineering Blog')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'about' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'About AnyFileX')}
              </li>
              <li className="text-left">
                {renderAnchor({ view: 'contact' }, 'text-left block w-full hover:text-blue-400 transition-colors cursor-pointer leading-snug', 'Contact Support')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>© {new Date().getFullYear()} AnyFileX. Open Any File in Seconds with AnyFileX. All rights reserved.</div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for web power users</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
