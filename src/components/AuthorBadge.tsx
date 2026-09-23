'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { getAuthorByName, AuthorQualification } from '../lib/content/editorialTeam';
import { AuthorModal } from './AuthorModal';
import { AppRoute } from '../types';

interface AuthorBadgeProps {
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  qualifications?: string[];
  credentials?: string;
  date?: string;
  lastAuditedDate?: string;
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
  showCredentials?: boolean;
  showAuditDate?: boolean;
  onNavigate?: (route: AppRoute) => void;
  className?: string;
}

export const AuthorBadge: React.FC<AuthorBadgeProps> = ({
  authorName,
  authorRole,
  authorAvatar,
  credentials,
  date,
  lastAuditedDate,
  size = 'md',
  showRole = true,
  showCredentials = true,
  showAuditDate = false,
  onNavigate,
  className = ''
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const authorData: AuthorQualification = getAuthorByName(authorName);

  const effectiveAvatar = authorData.avatar || authorAvatar;
  const effectiveCredentials = credentials || authorData.credentials;
  const effectiveRole = authorRole || authorData.role;

  const avatarSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl'
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setModalOpen(true);
        }}
        className={`group inline-flex items-center gap-2.5 cursor-pointer rounded-xl p-1 -m-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${className}`}
        title={`View ${authorData.name} credentials & editorial qualifications`}
      >
        <div className="relative shrink-0">
          <img
            src={effectiveAvatar}
            alt={authorData.name}
            className={`${avatarSizes[size]} object-cover border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform`}
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow-xs ring-1 ring-white dark:ring-slate-900">
            ✓
          </span>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs sm:text-sm">
              {authorData.name}
            </span>
            {showCredentials && effectiveCredentials && (
              <span className="px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200/60 dark:border-blue-800/60 leading-none">
                {effectiveCredentials}
              </span>
            )}
          </div>

          {showRole && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[200px] sm:max-w-[260px]">
              {effectiveRole}
            </div>
          )}

          {showAuditDate && (date || lastAuditedDate) && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {lastAuditedDate ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Audited {lastAuditedDate}</span>
              ) : (
                <span>Updated {date}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <AuthorModal
        author={authorData}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
