'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';

export const NewsletterSection: React.FC = () => {
  const locale = useLocale();
  const copy = locale === 'nl' ? {
    label: 'AnyFileX-nieuwsbrief', title: 'Blijf op de hoogte met AnyFileX', description: 'Ontvang elke maand nieuwe handleidingen, software-updates en diagnostische tools. Geen spam.', placeholder: 'Vul je e-mailadres in...', button: 'Inschrijven', success: 'Bedankt! Je bent aangemeld voor de AnyFileX-nieuwsbrief.', audience: 'Voor ontwikkelaars, systeembeheerders en digitale archivarissen. Afmelden kan altijd.',
  } : locale === 'es' ? {
    label: 'Boletín de AnyFileX', title: 'Mantente al día con AnyFileX', description: 'Recibe cada mes nuevas guías, actualizaciones de software y herramientas de diagnóstico. Sin spam.', placeholder: 'Escribe tu correo electrónico...', button: 'Suscribirme', success: '¡Gracias! Te has suscrito al boletín de AnyFileX.', audience: 'Para desarrolladores, administradores de sistemas y archivistas digitales. Puedes cancelar cuando quieras.',
  } : {
    label: 'AnyFileX Newsletter', title: 'Stay Updated with AnyFileX', description: 'Get new AnyFileX file guides, software updates, and diagnostic tools delivered monthly. Zero spam.', placeholder: 'Enter your email address...', button: 'Subscribe', success: 'Thank you! You have been subscribed to the AnyFileX newsletter.', audience: 'Join developers, system administrators, and digital archivists receiving the AnyFileX monthly bulletin. Unsubscribe at any time with 1 click.',
  };
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Mail className="w-6 h-6" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {copy.label}
          </span>

          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
            {copy.title}
          </h2>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {copy.description}
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
                id="newsletter-email-input"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 shrink-0 cursor-pointer flex items-center justify-center gap-2"
                id="newsletter-subscribe-btn"
              >
                <span>{copy.button}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{copy.success}</span>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
            {copy.audience}
          </p>
        </div>
      </div>
    </section>
  );
};
