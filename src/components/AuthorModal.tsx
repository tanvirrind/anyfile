import React from 'react';
import { X, ShieldCheck, Award, BookOpen, GraduationCap, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { AuthorQualification } from '../lib/content/editorialTeam';
import { AppRoute } from '../types';

interface AuthorModalProps {
  author: AuthorQualification | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: AppRoute) => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({
  author,
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen || !author) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      id="author-profile-modal-backdrop"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="author-profile-modal-dialog"
      >
        {/* Header with Close */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-4">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold font-heading">{author.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  {author.credentials}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {author.role}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Editorial Board Contributor • {author.yearsExperience} Years Experience</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close author modal"
            id="close-author-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Biography */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              Technical Background & Biography
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {author.bio}
            </p>
          </div>

          {/* Education & Academic Qualifications */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              Education & Academic Degree
            </h4>
            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200">
              {author.education}
            </p>
          </div>

          {/* Professional Certifications & Standards Working Groups */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-500" />
              Verified Industry Certifications & Standards Bodies
            </h4>
            <ul className="space-y-2">
              {author.certifications.map((cert, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas of Core Expertise */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Primary Format & Forensic Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {author.areasOfExpertise.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Editorial Independence & Conflict of Interest Disclosure */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Independence & Conflict of Interest Disclosure
            </div>
            <p className="text-xs leading-relaxed">
              {author.conflictOfInterestDisclosure}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-4">
          {onNavigate ? (
            <button
              onClick={() => {
                onClose();
                onNavigate({ view: 'editorial-standards' } as any);
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View Editorial Standards & Testing Methodology</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-xs text-slate-500">AnyFileX Editorial Integrity Protocol</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
