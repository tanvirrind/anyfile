import React, { useState } from 'react';
import {
  Upload,
  Layers,
  Box,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Download,
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { parseStl, StlParseResult, exportBinaryStl } from '../../lib/3d/stlEngine';
import { getSampleStlBuffer } from '../../lib/3d/sampleMesh';
import { ThreeDViewer } from '../3d/ThreeDViewer';
import { AppRoute } from '../../types';

interface StlViewerWorkspaceProps {
  initialFile?: File;
  onNavigate?: (route: AppRoute) => void;
}

export const StlViewerWorkspace: React.FC<StlViewerWorkspaceProps> = ({ onNavigate }) => {
  const [parseResult, setParseResult] = useState<StlParseResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processBuffer = (buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = parseStl(buffer);
      setParseResult(result);
      setFileName(name);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse STL file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        processBuffer(reader.result, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        processBuffer(reader.result, file.name);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const loadSample = async () => {
    setIsLoading(true);
    try {
      const buffer = await getSampleStlBuffer();
      processBuffer(buffer, '20mm_Calibration_Cube.stl');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate sample model.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBinary = () => {
    if (!parseResult) return;
    const blob = exportBinaryStl(parseResult.facets, `AnyFileX Binary STL: ${fileName}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.stl$/i, '') + '-binary.stl';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload & Dropzone Area */}
      {!parseResult && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center bg-white dark:bg-slate-900/50 transition-all shadow-xs"
        >
          <input
            type="file"
            accept=".stl"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="stl-file-input"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Drop your .STL 3D model here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Binary or ASCII format. 100% private in-browser WebGL rendering with zero cloud uploads.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label
                htmlFor="stl-file-input"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Browse File</span>
              </label>

              <button
                type="button"
                onClick={loadSample}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Load Sample 20mm Cube</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Tessellating 3D geometry in browser memory...</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Error Parsing STL</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 3D Interactive Viewport & Diagnostics */}
      {parseResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                {parseResult.diagnostics.isBinary ? 'Binary STL' : 'ASCII STL'}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {fileName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadBinary}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Binary</span>
              </button>

              <label
                htmlFor="stl-file-input-change"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Open Another</span>
                <input
                  type="file"
                  accept=".stl"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="stl-file-input-change"
                />
              </label>
            </div>
          </div>

          {/* Interactive WebGL Canvas */}
          <ThreeDViewer
            positions={parseResult.positions}
            normals={parseResult.normals}
            boundingBox={parseResult.diagnostics.boundingBox}
            triangleCount={parseResult.diagnostics.triangleCount}
            title={fileName}
            height={520}
          />

          {/* Metric Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Dimensions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Box className="w-4 h-4 text-blue-500" />
                <span>Dimensions</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                {parseResult.diagnostics.boundingBox.size.x.toFixed(1)} × {parseResult.diagnostics.boundingBox.size.y.toFixed(1)} × {parseResult.diagnostics.boundingBox.size.z.toFixed(1)} mm
              </p>
            </div>

            {/* Triangles */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Layers className="w-4 h-4 text-cyan-500" />
                <span>Triangle Count</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                {parseResult.diagnostics.triangleCount.toLocaleString()} facets
              </p>
            </div>

            {/* Volume */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Scale className="w-4 h-4 text-emerald-500" />
                <span>Solid Volume</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                {parseResult.diagnostics.volumeCm3.toFixed(2)} cm³
              </p>
            </div>

            {/* Manifold Status */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                {parseResult.diagnostics.isWatertight ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                )}
                <span>Mesh Integrity</span>
              </div>
              <p className={`text-sm sm:text-base font-bold font-mono ${
                parseResult.diagnostics.isWatertight ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {parseResult.diagnostics.isWatertight ? 'Watertight Manifold' : `${parseResult.diagnostics.nonManifoldEdgesCount} Boundary Edges`}
              </p>
            </div>
          </div>

          {/* 3D Print Filament & Slicing Estimates */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span>3D Printing Material & Weight Estimates (at ~20% Gyroid Infill)</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">PLA Filament</span>
                <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                  ~{parseResult.diagnostics.estimatedWeightGrams.pla} g
                </span>
                <span className="text-[10px] text-slate-500 block">Density: 1.24 g/cm³</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">PETG Filament</span>
                <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  ~{parseResult.diagnostics.estimatedWeightGrams.petg} g
                </span>
                <span className="text-[10px] text-slate-500 block">Density: 1.27 g/cm³</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">ABS Filament</span>
                <span className="text-lg font-mono font-extrabold text-amber-600 dark:text-amber-400">
                  ~{parseResult.diagnostics.estimatedWeightGrams.abs} g
                </span>
                <span className="text-[10px] text-slate-500 block">Density: 1.04 g/cm³</span>
              </div>
            </div>

            {/* Quick Actions Bar to Other 3MF/STL Tools */}
            <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <span className="text-slate-500">Related 3D Workflows:</span>
              <button
                onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'stl-repair' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Repair Mesh Defects</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate?.({ view: 'converter-detail', id: '3mf-to-stl' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Convert 3MF to STL</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate?.({ view: 'comparison-detail', slug: '3mf-vs-stl' })}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>3MF vs STL Comparison</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
