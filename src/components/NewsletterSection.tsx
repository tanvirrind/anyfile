import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
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
            AnyFileX Newsletter
          </span>

          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
            Stay Updated with AnyFileX
          </h2>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Get new AnyFileX file guides, software updates, and diagnostic tools delivered monthly. Zero spam.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
                id="newsletter-email-input"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 shrink-0 cursor-pointer flex items-center justify-center gap-2"
                id="newsletter-subscribe-btn"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Thank you! You have been subscribed to the AnyFileX newsletter.</span>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
            Join developers, system administrators, and digital archivists receiving the AnyFileX monthly bulletin. Unsubscribe at any time with 1 click.
          </p>
        </div>
      </div>
    </section>
  );
};
