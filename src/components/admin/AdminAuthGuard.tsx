'use client';

import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { AppRoute } from '../../types';
import { SEOHead } from '../SEOHead';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  onNavigate: (route: AppRoute) => void;
  currentRoute: AppRoute;
}

/**
 * The legacy credential authentication flow has been removed. Admin tooling
 * remains non-indexable but is intentionally unavailable until a supported
 * authentication provider is added.
 */
export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ onNavigate }) => (
  <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-slate-100">
    <SEOHead
      title="Admin Unavailable | AnyFileX"
      description="Administrative tools are unavailable in this deployment."
      canonicalPath="/admin"
      robots="noindex, nofollow, noarchive, nosnippet"
    />
    <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center space-y-5">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold font-heading text-white">Admin tools unavailable</h1>
      <p className="text-sm text-slate-400">
        The legacy admin credential has been removed. Administrative access will return
        when a supported authentication provider is configured.
      </p>
      <button
        type="button"
        onClick={() => onNavigate({ view: 'home' })}
        className="mx-auto text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to AnyFileX
      </button>
    </div>
  </div>
);
