'use client';

import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Key,
  User,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  Database,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { AppRoute } from '../../types';
import {
  AdminUser,
  getAdminSession,
  loginAdmin,
  logoutAdmin
} from '../../lib/auth/adminAuth';
import { SEOHead } from '../SEOHead';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  onNavigate: (route: AppRoute) => void;
  currentRoute: AppRoute;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  onNavigate,
  currentRoute,
}) => {
  const [session, setSession] = useState<AdminUser | null>(() => getAdminSession());
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passkey.trim()) {
      setErrorMessage('Please enter the admin passphrase.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await loginAdmin(passkey, rememberMe);
    setIsLoading(false);
    if (result.success && result.user) {
      setSession(result.user);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || 'Authentication rejected. Unauthorized access.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
    setPasskey('');
  };

  // If user is authenticated, render the admin navigation bar and page children
  if (session) {
    const isDbCms = currentRoute.view === 'admin';
    const isContentStudio = currentRoute.view === 'content-dashboard';

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Enforce noindex on authenticated CMS pages */}
        <SEOHead
          title="Admin CMS & Content Authority Studio | AnyFileX"
          description="Internal Administrative Control Center"
          canonicalPath={isDbCms ? '/admin' : '/admin/content'}
          robots="noindex, nofollow, noarchive, nosnippet"
        />

        {/* Persistent Authenticated Admin Header */}
        <aside aria-label="Administrative Session Controls" className="sticky top-0 z-40 bg-slate-900 text-slate-200 border-b border-slate-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 text-xs">
            {/* Left: Identity & Security Badge */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ADMIN AUTHENTICATED</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-white">{session.email}</span>
                <span className="text-slate-500">({session.role})</span>
              </div>
            </div>

            {/* Middle: Internal Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => onNavigate({ view: 'admin' })}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                  isDbCms
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Database CMS</span>
                <span className="md:hidden">DB CMS</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ view: 'content-dashboard' })}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                  isContentStudio
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Content Authority Studio</span>
                <span className="md:hidden">Content Studio</span>
              </button>
            </div>

            {/* Right: Return to Public Site & Sign Out */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate({ view: 'home' })}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span>Public Site</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-medium transition-colors"
                title="End Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Protected Admin Content */}
        <main>{children}</main>
      </div>
    );
  }

  // Not authenticated: Render Secure Admin Login Portal
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-slate-100">
      <SEOHead
        title="Admin Authentication Required | AnyFileX"
        description="Restricted administrative access. Authentication credentials required."
        canonicalPath="/admin"
        robots="noindex, nofollow, noarchive, nosnippet"
      />

      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Access Control</span>
          </div>

          <h1 className="text-2xl font-bold font-heading text-white">
            Administrative CMS Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access the Content Authority Studio and Format Database Engine.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Access Denied</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Security Passkey
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={isLoading}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Verifying clearance...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate & Access CMS</span>
              </>
            )}
          </button>
        </form>

        {/* Security & Access Policies */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3 text-[11px] text-slate-400">
          <div className="flex items-start gap-2 text-left">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>Authorized access only: Unauthorized intrusion attempts violate security policies and are tracked.</span>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'home' })}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>← Return to AnyFileX Homepage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
