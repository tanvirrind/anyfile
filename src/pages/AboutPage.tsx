import React from 'react';
import { ShieldCheck, Zap, Lock, Globe, Server, Code, Users, Award, Sparkles } from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { StatsCard } from '../components/StatsCard';
import { SEOHead } from '../components/SEOHead';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <SEOHead
        title="About AnyFileX – Universal Digital File Intelligence"
        description="Learn about AnyFileX mission, privacy-first client-side WebAssembly architecture, and our open database of 10,000+ indexed file formats."
        canonicalPath="/about"
      />
      <Breadcrumb items={[{ label: 'About AnyFileX' }]} onNavigate={onNavigate} />

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">Our Mission & Infrastructure</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          Democratizing File Accessibility for Everyone
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          AnyFileX.com was founded to solve a universal headache: encountering an unknown digital file extension that refuses to open. Open any file in seconds with AnyFileX.com.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Indexed Formats" value="10,000+" subtitle="File extensions & magic bytes" icon={<Zap className="w-5 h-5" />} />
        <StatsCard label="Monthly Users" value="2.4M+" subtitle="Globally active file inspectors" icon={<Globe className="w-5 h-5" />} />
        <StatsCard label="Client Processing" value="100%" subtitle="Privacy via browser WebAssembly" icon={<Lock className="w-5 h-5" />} />
        <StatsCard label="Uptime Guarantee" value="99.99%" subtitle="Cloudflare Edge Network" icon={<Server className="w-5 h-5" />} />
      </div>

      {/* Philosophy & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy-First Architecture</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike legacy conversion websites that require uploading sensitive personal documents to remote cloud servers, AnyFileX runs binary parsing and image re-encoding locally inside your browser memory using WebAssembly (WASM). Your photos, CAD blueprints, and documents never leave your device.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Speed & Precision</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By reading magic byte headers directly at the byte level, AnyFileX instantly identifies true file signatures even if the extension has been corrupted, omitted, or disguised.
          </p>
        </div>
      </div>
    </div>
  );
};
