'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react';
import { FileTypeInfo } from '../../types';

interface ExtensionHowToOpenSectionProps {
  item: FileTypeInfo;
  onNavigate: (route: any) => void;
}

export const ExtensionHowToOpenSection: React.FC<ExtensionHowToOpenSectionProps> = ({
  item,
  onNavigate,
}) => {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'browser'>('windows');

  // osSupport is optional on FileTypeInfo; a missing value means "not supported".
  const os = item.osSupport;
  const platforms = [
    { id: 'windows', label: 'Windows', icon: Monitor, supported: os?.windows ?? false },
    { id: 'mac', label: 'macOS', icon: Laptop, supported: os?.mac ?? false },
    { id: 'linux', label: 'Linux', icon: Monitor, supported: os?.linux ?? false },
    { id: 'android', label: 'Android', icon: Smartphone, supported: os?.android ?? false },
    { id: 'ios', label: 'iPhone / iPad', icon: Smartphone, supported: os?.ios ?? false },
    { id: 'browser', label: 'In Browser', icon: Globe, supported: true },
  ];

  const getPlatformGuide = (os: string) => {
    const ext = item.extension.toUpperCase();
    const appsList = item.popularApps.map((a) => a.name).join(', ') || 'supported software';

    switch (os) {
      case 'windows':
        return [
          {
            step: '1',
            title: `Check Default App Association`,
            desc: `Double-click the .${ext} file in Windows File Explorer. If Windows prompts you to pick an app, select ${item.popularApps[0]?.name || 'a supported file reader'}.`,
          },
          {
            step: '2',
            title: `Install Compatible Software`,
            desc: `If no default app is installed, download ${appsList} or use Windows Store codecs if available.`,
          },
          {
            step: '3',
            title: `Inspect Hex Header / Magic Bytes`,
            desc: `If Windows displays an "Invalid File Format" error, inspect magic bytes (${item.magicBytesHex}) using AnyFileX's free Header Verifier.`,
          },
        ];

      case 'mac':
        return [
          {
            step: '1',
            title: `Open via Finder or Preview`,
            desc: `Right-click (Control-click) the .${ext} file in macOS Finder and hover over 'Open With'.`,
          },
          {
            step: '2',
            title: `Select Native macOS Application`,
            desc: `Choose ${item.popularApps[0]?.name || 'Preview'} from the application list, or choose 'Other...' to locate your preferred tool.`,
          },
          {
            step: '3',
            title: `Set Permanent File Association`,
            desc: `Press Command + I on the .${ext} file, expand 'Open with', select your application, and click 'Change All...'.`,
          },
        ];

      case 'linux':
        return [
          {
            step: '1',
            title: `Identify MIME Type via Terminal`,
            desc: `Run 'file --mime-type filename.${item.extension.toLowerCase()}' in Linux terminal. Expected MIME: ${item.mimeType}.`,
          },
          {
            step: '2',
            title: `Launch with Linux Package or AppImage`,
            desc: `Use package managers (apt, dnf, pacman, flatpak) to install compatible readers or open with ImageMagick / GIMP / LibreOffice.`,
          },
        ];

      case 'android':
        return [
          {
            step: '1',
            title: `Tap File in Files or Google Drive`,
            desc: `Tap the .${ext} attachment in Gmail or Android Files app.`,
          },
          {
            step: '2',
            title: `Choose Compatible Android Viewer`,
            desc: `Select an app from the 'Open with' popup or convert to PDF/JPG directly in Chrome browser.`,
          },
        ];

      case 'ios':
        return [
          {
            step: '1',
            title: `Open via Apple Files App`,
            desc: `Locate the .${ext} file in the Files app on iPhone or iPad.`,
          },
          {
            step: '2',
            title: `Use Quick Look or Share Sheet`,
            desc: `Tap the file to trigger iOS Quick Look preview, or tap the Share button to send to a compatible app.`,
          },
        ];

      case 'browser':
      default:
        return [
          {
            step: '1',
            title: `Instant In-Browser Viewer & Converter`,
            desc: `No installation required! Drag and drop your .${ext} file directly into AnyFileX's online viewer and converter.`,
          },
          {
            step: '2',
            title: `Client-Side Privacy Protection`,
            desc: `Your .${ext} file is processed locally in your web browser without uploading sensitive data to external servers.`,
          },
        ];
    }
  };

  const steps = getPlatformGuide(selectedOS);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Monitor className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            How to Open .{item.extension} Files
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Select Operating System
        </span>
      </div>

      {/* OS Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {platforms.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedOS === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedOS(p.id as any)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{p.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected
                    ? 'bg-blue-500/40 text-white'
                    : p.supported
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}
              >
                {p.supported ? 'Supported' : 'Plugin Needed'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step List for Selected OS */}
      <div className="space-y-3 pt-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              <span className="w-6 h-6 rounded-xl bg-blue-600 text-white text-xs flex items-center justify-center shrink-0 shadow-xs">
                {s.step}
              </span>
              <span>{s.title}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action for In-Browser Tool */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5 max-w-xl">
          <p className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
            Need to open .{item.extension} without downloading software?
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Use AnyFileX's free browser inspector to verify header integrity and convert instantly.
          </p>
        </div>

        <button
          onClick={() => onNavigate({ view: 'tools', toolId: 'identifier' })}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <span>Open File Online</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
