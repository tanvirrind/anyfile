'use client';

import React, { useState } from 'react';
import {
  Upload,
  Layers,
  Box,
  FileCode,
  Download,
  Sparkles,
  ShieldAlert,
  Info,
  ExternalLink,
  Cpu,
  Archive
} from 'lucide-react';
import { parse3mf, ThreeMfPackageInfo, convert3mfToStl } from '../../lib/3d/threeMfEngine';
import { getSample3mfBuffer } from '../../lib/3d/sampleMesh';
import { ThreeDViewer } from '../3d/ThreeDViewer';
import { AppRoute } from '../../types';

interface ThreeMfViewerWorkspaceProps {
  onNavigate?: (route: AppRoute) => void;
}

export const ThreeMfViewerWorkspace: React.FC<ThreeMfViewerWorkspaceProps> = ({ onNavigate }) => {
  const [packageInfo, setPackageInfo] = useState<ThreeMfPackageInfo | null>(null);
  const [rawBuffer, setRawBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedObjectId, setSelectedObjectId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'3d' | 'package' | 'objects'>('3d');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flattened position floats for ThreeDViewer
  const [positions, setPositions] = useState<Float32Array | null>(null);

  const processBuffer = async (buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const info = await parse3mf(buffer);
      setPackageInfo(info);
      setRawBuffer(buffer);
      setFileName(name);

      // Build initial position array for all objects combined
      updateGeometry(info, 'all');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse 3MF file.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGeometry = (info: ThreeMfPackageInfo, objId: string) => {
    const targetObjects = objId === 'all'
      ? info.objects
      : info.objects.filter(o => o.id === objId);

    const positionsArr: number[] = [];
    for (const obj of targetObjects) {
      for (const [i1, i2, i3] of obj.triangles) {
        if (i1 < obj.vertices.length && i2 < obj.vertices.length && i3 < obj.vertices.length) {
          const v1 = obj.vertices[i1];
          const v2 = obj.vertices[i2];
          const v3 = obj.vertices[i3];
          positionsArr.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z);
        }
      }
    }
    setPositions(new Float32Array(positionsArr));
  };

  const handleObjectChange = (objId: string) => {
    setSelectedObjectId(objId);
    if (packageInfo) {
      updateGeometry(packageInfo, objId);
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
      const buffer = await getSample3mfBuffer();
      processBuffer(buffer, 'Sample_Calibration_Cube.3mf');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate sample 3MF.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsStl = async () => {
    if (!rawBuffer) return;
    try {
      const result = await convert3mfToStl(
        rawBuffer,
        selectedObjectId === 'all' ? undefined : selectedObjectId
      );
      const a = document.createElement('a');
      a.href = result.stlBlobUrl;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(result.stlBlobUrl);
    } catch (err: any) {
      setErrorMessage(`Export error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload & Dropzone Area */}
      {!packageInfo && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center bg-white dark:bg-slate-900/50 transition-all shadow-xs"
        >
          <input
            type="file"
            accept=".3mf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="threemf-file-input"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Drop your .3MF 3D Manufacturing package here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Inspect 3D printing project files from Bambu Studio, PrusaSlicer, OrcaSlicer, or Cura with 100% in-browser security.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label
                htmlFor="threemf-file-input"
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
                <span>Load Sample 3MF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Unpacking 3MF package manifest and extracting geometry...</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Error Opening 3MF</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      {packageInfo && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 px-3 py-0.5 rounded-full">
                  3MF Package
                </span>
                {packageInfo.slicerOrigin && packageInfo.slicerOrigin !== 'Generic 3MF' && (
                  <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                    {packageInfo.slicerOrigin}
                  </span>
                )}
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {packageInfo.title || fileName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Units: <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{packageInfo.unit}</span> • Objects: <span className="font-semibold text-slate-700 dark:text-slate-300">{packageInfo.objects.length}</span> • Total Facets: <span className="font-semibold text-slate-700 dark:text-slate-300">{packageInfo.totalTriangles.toLocaleString()}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportAsStl}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export as STL</span>
              </button>

              <label
                htmlFor="threemf-file-input-change"
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Open Another</span>
                <input
                  type="file"
                  accept=".3mf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="threemf-file-input-change"
                />
              </label>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('3d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>3D Model View</span>
            </button>
            <button
              onClick={() => setActiveTab('objects')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'objects'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Objects & Parts ({packageInfo.objects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('package')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'package'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Package Files ({packageInfo.containedFiles.length})</span>
            </button>
          </div>

          {/* Tab 1: 3D Viewport */}
          {activeTab === '3d' && (
            <div className="space-y-4">
              {/* Part Isolation Selector */}
              {packageInfo.objects.length > 1 && (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500 pl-2">View Part:</span>
                  <select
                    value={selectedObjectId}
                    onChange={(e) => handleObjectChange(e.target.value)}
                    className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="all">All Parts Combined ({packageInfo.objects.length})</option>
                    {packageInfo.objects.map((obj) => (
                      <option key={obj.id} value={obj.id}>
                        {obj.name} ({obj.triangleCount.toLocaleString()} triangles)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {positions && (
                <ThreeDViewer
                  positions={positions}
                  title={packageInfo.title || fileName}
                  triangleCount={
                    selectedObjectId === 'all'
                      ? packageInfo.totalTriangles
                      : packageInfo.objects.find(o => o.id === selectedObjectId)?.triangleCount
                  }
                  height={520}
                />
              )}
            </div>
          )}

          {/* Tab 2: Objects Hierarchy */}
          {activeTab === 'objects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageInfo.objects.map((obj) => (
                <div
                  key={obj.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                        Object ID #{obj.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{obj.name}</h4>
                    </div>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 font-mono">
                      Type: {obj.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Triangles</span>
                      <span className="font-bold text-slate-900 dark:text-white">{obj.triangleCount.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Vertices</span>
                      <span className="font-bold text-slate-900 dark:text-white">{obj.vertexCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Package Container File Tree */}
          {activeTab === 'package' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span>Open Packaging Convention (OPC) Container Contents</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A .3MF file is a compressed ZIP package. Below are all files detected inside this container:
              </p>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
                {packageInfo.containedFiles.map((file) => (
                  <div key={file} className="p-3 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-blue-500" />
                      <span>{file}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {file.toLowerCase().endsWith('.model') ? '3D Geometry' : file.toLowerCase().endsWith('.rels') ? 'Relationships' : 'Package Asset'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span>Related 3D Tools:</span>
            <button
              onClick={() => onNavigate?.({ view: 'converter-detail', id: '3mf-to-stl' })}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Convert 3MF to STL</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'stl-viewer' })}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>STL Viewer</span>
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
