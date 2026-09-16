import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, Bug, FilePlus, HelpCircle } from 'lucide-react';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';

interface ContactPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'support' | 'suggest-ext' | 'suggest-tool' | 'bug'>('support');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title="Contact AnyFileX – Support, Inquiries & Format Suggestions"
        description="Get in touch with the AnyFileX team for format requests, technical support, bug reports, and partnership inquiries."
        canonicalPath="/contact"
      />
      <Breadcrumb items={[{ label: 'Contact & Support' }]} onNavigate={onNavigate} />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="blue" size="md">Get in Touch</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          Contact AnyFileX Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Have a question, extension addition request, bug report, or partnership inquiry? We're here to help.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
          id="contact-tab-support"
        >
          General Support
        </button>
        <button
          onClick={() => setActiveTab('suggest-ext')}
          className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
            activeTab === 'suggest-ext'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
          id="contact-tab-suggest-ext"
        >
          Suggest Extension
        </button>
        <button
          onClick={() => setActiveTab('suggest-tool')}
          className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
            activeTab === 'suggest-tool'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
          id="contact-tab-suggest-tool"
        >
          Suggest Tool
        </button>
        <button
          onClick={() => setActiveTab('bug')}
          className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
            activeTab === 'bug'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
          id="contact-tab-bug"
        >
          Report Bug
        </button>
      </div>

      {/* Form Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Received!</h3>
            <p className="text-sm text-slate-500">Thank you for contacting us. Our engineering team will review your message shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  id="contact-form-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  id="contact-form-email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject / Extension Name</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder={activeTab === 'suggest-ext' ? 'e.g. Please add .CR3 Raw photo extension' : 'Brief subject summary'}
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                id="contact-form-subject"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Details / Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe what file format or feature you would like to see on AnyFileX..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                id="contact-form-message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="contact-form-submit-btn"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
