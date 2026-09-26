'use client';

import React, { useState } from 'react';
import {
  Upload,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Download,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
  Box,
  RotateCcw
} from 'lucide-react';
import { parseStl, repairStl, StlParseResult, StlRepairResult } from '../../lib/3d/stlEngine';
import { getSampleStlBuffer } from '../../lib/3d/sampleMesh';
import { ThreeDViewer } from '../3d/ThreeDViewer';
import { AppRoute } from '../../types';

interface StlRepairWorkspaceProps {
  onNavigate?: (route: AppRoute) => void;
}

export const StlRepairWorkspace: React.FC<StlRepairWorkspaceProps> = ({ onNavigate }) => {
  const [rawBuffer, setRawBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [initialParse, setInitialParse] = useState<StlParseResult | null>(null);
  const [repairResult, setRepairResult] = useState<StlRepairResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processBuffer = (buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRepairResult(null);
    try {
      const parsed = parseStl(buffer);
      setRawBuffer(buffer);
      setInitialParse(parsed);
      setFileName(name);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to inspect STL mesh.');
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
      processBuffer(buffer, 'Calibration_Cube.stl');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate sample.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeRepair = () => {
    if (!rawBuffer) return;
    setIsLoading(true);
    try {
      const result = repairStl(rawBuffer);
      setRepairResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to repair mesh.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRepaired = () => {
    if (!repairResult) return;
    const a = document.createElement('a');
    a.href = repairResult.repairedBlobUrl;
    a.download = fileName.replace(/\.stl$/i, '') + '-repaired.stl';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload & Dropzone Area */}
      {!initialParse && (
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
            id="stl-repair-input"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Wrench className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Upload STL file to diagnose & normalize
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Diagnoses non-manifold edges, inverted normals, and degenerate facets. The available normalization removes degenerate facets and recalculates normals; it does not fill holes or make meshes watertight.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label
                htmlFor="stl-repair-input"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Select STL File</span>
              </label>

              <button
                type="button"
                onClick={loadSample}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Load Sample Mesh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white space-y-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Analyzing mesh manifold integrity and normal vectors...</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Error</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Repair Analysis View */}
      {initialParse && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-3 py-0.5 rounded-full">
                  Mesh Diagnostic Mode
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {fileName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {initialParse.diagnostics.triangleCount.toLocaleString()} triangles • {initialParse.diagnostics.isWatertight ? 'Watertight (No Holes)' : 'Non-Manifold Edges Detected'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!repairResult ? (
                <button
                  onClick={executeRepair}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Normalize Supported Defects</span>
                </button>
              ) : (
                <button
                  onClick={downloadRepaired}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                    <span>Download Normalized STL</span>
                </button>
              )}

              <label
                htmlFor="stl-repair-input-change"
                className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Other</span>
                <input
                  type="file"
                  accept=".stl"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="stl-repair-input-change"
                />
              </label>
            </div>
          </div>

          {/* Diagnostic Defect Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Defect 1: Degenerate Triangles */}
            <div className={`p-4 rounded-2xl border ${
              initialParse.diagnostics.degenerateFacetsCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Degenerate Triangles</span>
                {initialParse.diagnostics.degenerateFacetsCount > 0 ? (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                {initialParse.diagnostics.degenerateFacetsCount}
              </p>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {initialParse.diagnostics.degenerateFacetsCount > 0
                  ? 'Zero-area or collinear facets (causes slicer slicing artifacts)'
                  : 'All triangles have valid positive surface area'}
              </span>
            </div>

            {/* Defect 2: Inverted / Inconsistent Normals */}
            <div className={`p-4 rounded-2xl border ${
              initialParse.diagnostics.invertedNormalsCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Inverted Face Normals</span>
                {initialParse.diagnostics.invertedNormalsCount > 0 ? (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                {initialParse.diagnostics.invertedNormalsCount}
              </p>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {initialParse.diagnostics.invertedNormalsCount > 0
                  ? 'Flipped normals cause slicers to confuse inside vs outside'
                  : 'Consistent outward-facing surface normals'}
              </span>
            </div>

            {/* Defect 3: Non-Manifold Boundary Edges */}
            <div className={`p-4 rounded-2xl border ${
              initialParse.diagnostics.nonManifoldEdgesCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Non-Manifold Edges</span>
                {initialParse.diagnostics.nonManifoldEdgesCount > 0 ? (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
                {initialParse.diagnostics.nonManifoldEdgesCount}
              </p>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {initialParse.diagnostics.nonManifoldEdgesCount > 0
                  ? 'Boundary seams or open holes detected in shell'
                  : 'Closed watertight manifold solid'}
              </span>
            </div>
          </div>

          {/* Repaired Summary Banner (if repaired) */}
          {repairResult && (
            <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    Normalization Complete: Recalculated {repairResult.recalculatedNormalsCount} Normals
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Filtered {repairResult.removedDegenerateCount} degenerate facets. Open or non-manifold edges were not filled and must be repaired in a mesh editor.
                  </p>
                </div>
              </div>

              <button
                onClick={downloadRepaired}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Normalized STL</span>
              </button>
            </div>
          )}

          {/* 3D WebGL Model Viewport */}
          <ThreeDViewer
            positions={initialParse.positions}
            normals={initialParse.normals}
            boundingBox={initialParse.diagnostics.boundingBox}
            triangleCount={initialParse.diagnostics.triangleCount}
            title={fileName}
            height={500}
          />

          {/* Quick Links */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span>Related 3D Tools:</span>
            <button
              onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'stl-viewer' })}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>STL Viewer</span>
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
      )}
    </div>
  );
};
