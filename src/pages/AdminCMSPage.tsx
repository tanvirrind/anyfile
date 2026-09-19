import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  FileText,
  Plus,
  RefreshCw,
  Layers,
  Activity,
  History,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Download,
  FileJson,
  FileSpreadsheet,
  Check,
  Edit,
  Eye
} from 'lucide-react';
import { FileTypeInfo, CategoryType, AppRoute } from '../types';
import { fileFormatDB, CMSAuditLog, CMSAnalytics } from '../lib/database/fileFormatDatabase';
import { SchemaMarkupView } from '../components/SchemaMarkupView';
import { SEOHead } from '../components/SEOHead';

interface AdminCMSPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminCMSPage: React.FC<AdminCMSPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'import' | 'approvals' | 'audit' | 'moderation'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [analytics, setAnalytics] = useState<CMSAnalytics>(() => fileFormatDB.getAnalytics());
  const [extensions, setExtensions] = useState<FileTypeInfo[]>([]);
  const [auditLogs, setAuditLogs] = useState<CMSAuditLog[]>([]);

  // Bulk Import state
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [importResult, setImportResult] = useState<{ importedCount: number; errors: string[] } | null>(null);

  // Edit/Add Format Modal
  const [selectedFormat, setSelectedFormat] = useState<FileTypeInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const refreshData = () => {
    setAnalytics(fileFormatDB.getAnalytics());
    setAuditLogs(fileFormatDB.getAuditLogs());
    const res = fileFormatDB.searchExtensions(searchQuery, categoryFilter, riskFilter, statusFilter, 60);
    setExtensions(res);
  };

  useEffect(() => {
    refreshData();
  }, [searchQuery, categoryFilter, riskFilter, statusFilter, activeTab]);

  const handleBulkImport = () => {
    if (!importText.trim()) return;
    const res = fileFormatDB.bulkImport(importText, importFormat, 'Admin CMS User');
    setImportResult(res);
    refreshData();
  };

  const handleStatusChange = (ext: string, status: 'approved' | 'rejected' | 'draft') => {
    fileFormatDB.setApprovalStatus(ext, status, 'Admin Moderator');
    refreshData();
  };

  const adminSchema = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    'name': "AnyFileX 10,000+ File Format Database Admin CMS",
    'description': "Administrative interface for managing, indexing, and validating over 10,000 searchable file format specifications.",
    'publisher': {
      '@type': 'Organization',
      'name': 'AnyFileX'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="File Format Database Admin CMS & Catalog Engine"
        description="Administrative control center for managing the 10,000+ file extensions catalog, review pipelines, audit trails, and security moderation."
        canonicalPath="/admin"
        robots="noindex, nofollow, noarchive, nosnippet"
      />
      {/* CMS Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-blue-400" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Database CMS Engine • 10,000+ Extension Index</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            File Format Database Admin CMS
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Manage the searchable file extension registry. Index specifications, review import feeds, enforce security moderation, and manage operating system compatibility.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div>
              <span className="block text-xs font-semibold text-slate-400">Total Formats</span>
              <span className="text-xl font-mono font-bold text-blue-400">{analytics.totalExtensions.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Pending Approvals</span>
              <span className="text-xl font-mono font-bold text-amber-400">{analytics.pendingCount}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">MIME Entries</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{analytics.totalMimeTypes.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400">Search Volume</span>
              <span className="text-xl font-mono font-bold text-indigo-400">{analytics.searchQueriesCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'catalog', label: 'Extension Catalog (50K+)', icon: Database },
          { id: 'approvals', label: `Pending Approvals (${analytics.pendingCount})`, icon: Clock },
          { id: 'import', label: 'Bulk CSV / JSON Import', icon: Upload },
          { id: 'audit', label: 'Audit Log & History', icon: History },
          { id: 'moderation', label: 'Security & Moderation', icon: ShieldAlert },
          { id: 'analytics', label: 'Database Analytics', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXTENSION CATALOG & LIVE SEARCH */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search 10,000+ extensions, MIME types, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Images">Images</option>
                <option value="CAD & 3D">CAD & 3D</option>
                <option value="Documents">Documents</option>
                <option value="Archives">Archives</option>
                <option value="Audio & Video">Audio & Video</option>
                <option value="Code & Data">Code & Data</option>
                <option value="System & Executables">System & Executables</option>
                <option value="Databases">Databases</option>
                <option value="Medical & Science">Medical & Science</option>
              </select>

              {/* Risk Rating Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={() => setSelectedFormat(fileFormatDB.searchExtensions('DAT')[0] || null)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Format Schema</span>
              </button>
            </div>
          </div>

          {/* Formats Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 pl-5">Extension</th>
                    <th className="p-3.5">Name & Description</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">MIME Type</th>
                    <th className="p-3.5">Risk Rating</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  {extensions.map((ext) => (
                    <tr key={ext.extension} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 pl-5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        .{ext.extension}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{ext.name}</p>
                        <p className="text-slate-500 text-[11px] truncate">{ext.description}</p>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">
                        {ext.category}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        {ext.mimeType}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            ext.dangerRating === 'High Risk'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : ext.dangerRating === 'Medium Risk'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {ext.dangerRating}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {ext.approvalStatus || 'approved'}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right space-x-2">
                        <button
                          onClick={() => onNavigate({ view: 'extension-detail', ext: ext.extension.toLowerCase() })}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusChange(ext.extension, ext.approvalStatus === 'approved' ? 'rejected' : 'approved')}
                          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BULK CSV / JSON IMPORT */}
      {activeTab === 'import' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              <span>Bulk Format Ingestion Engine</span>
            </h2>
            <p className="text-xs text-slate-500">
              Paste JSON schemas or CSV header feeds to batch import hundreds or thousands of file extensions into the database queue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Format:</span>
            <button
              onClick={() => setImportFormat('json')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                importFormat === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>JSON Schema Array</span>
            </button>
            <button
              onClick={() => setImportFormat('csv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                importFormat === 'csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV File Format</span>
            </button>
          </div>

          <div className="space-y-2">
            <textarea
              rows={10}
              placeholder={
                importFormat === 'json'
                  ? '[\n  {\n    "extension": "RAW2",\n    "name": "Raw Camera Format",\n    "category": "Images",\n    "mimeType": "image/x-raw"\n  }\n]'
                  : 'extension,name,category,description,mimeType\nRAW2,Camera Raw File,Images,Digital raw camera graphics,image/x-raw'
              }
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBulkImport}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Upload className="w-4 h-4" />
              <span>Execute Bulk Ingestion</span>
            </button>

            {importResult && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Successfully imported {importResult.importedCount} formats.
              </span>
            )}
          </div>

          {importResult && importResult.errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
              <span className="font-bold">Validation warnings:</span>
              <ul className="list-disc list-inside">
                {importResult.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PENDING APPROVAL WORKFLOW */}
      {activeTab === 'approvals' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Pending Review Queue</span>
            </h2>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              {analytics.pendingCount} Formats Awaiting Review
            </span>
          </div>

          {extensions.filter((e) => e.approvalStatus === 'pending').length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-slate-900 dark:text-white">All pending format submissions reviewed!</p>
              <p className="text-xs text-slate-500">No draft or unapproved format submissions currently in queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {extensions
                .filter((e) => e.approvalStatus === 'pending')
                .map((item) => (
                  <div
                    key={item.extension}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-mono font-bold text-blue-600 text-sm">.{item.extension}</span>
                      <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-slate-500 text-[11px]">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(item.extension, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-700"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.extension, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-rose-700"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOG & VERSION HISTORY */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <span>Database Revision Audit Trail</span>
          </h2>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                      log.action === 'IMPORT'
                        ? 'bg-blue-100 text-blue-800'
                        : log.action === 'APPROVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {log.extension}
                  </span>
                  <span className="text-slate-500">{log.details}</span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()} • {log.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Executable Security & Malware Moderation Center</span>
          </h2>

          <p className="text-xs text-slate-500">
            Review format risk vectors, double extension security flags, and isolated executable sandboxing recommendations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-1">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">High Risk Executables</span>
              <p className="text-2xl font-mono font-bold text-rose-600">84 Formats</p>
              <p className="text-[11px] text-slate-500">Includes .EXE, .BAT, .VBS, .CMD, .PS1</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Macro Containers</span>
              <p className="text-2xl font-mono font-bold text-amber-600">142 Formats</p>
              <p className="text-[11px] text-slate-500">Includes .DOCM, .XLSM, .PPTM</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Safe Media & Data</span>
              <p className="text-2xl font-mono font-bold text-emerald-600">52,254 Formats</p>
              <p className="text-[11px] text-slate-500">Low risk image, video, document formats</p>
            </div>
          </div>
        </div>
      )}

      {/* Schema Markup View */}
      <SchemaMarkupView schemaData={adminSchema} title="DataCatalog Admin CMS JSON-LD Schema" />
    </div>
  );
};
