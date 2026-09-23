import React, { useState } from 'react';
import {
  Upload,
  ArrowRight,
  Download,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Box,
  Layers,
  Info,
  ExternalLink
} from 'lucide-react';
import { parse3mf, convert3mfToStl, ThreeMfPackageInfo, ThreeMfConversionResult } from '../../lib/3d/threeMfEngine';
import { getSample3mfBuffer } from '../../lib/3d/sampleMesh';
import { ThreeDViewer } from '../3d/ThreeDViewer';
import { AppRoute } from '../../types';

interface ThreeMfToStlWorkspaceProps {
  onNavigate?: (route: AppRoute) => void;
}

export const ThreeMfToStlWorkspace: React.FC<ThreeMfToStlWorkspaceProps> = ({ onNavigate }) => {
  const [rawBuffer, setRawBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [packageInfo, setPackageInfo] = useState<ThreeMfPackageInfo | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string>('all');
  const [conversionResult, setConversionResult] = useState<ThreeMfConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flattened position array for 3D Viewer
  const [positions, setPositions] = useState<Float32Array | null>(null);

  const processBuffer = async (buffer: ArrayBuffer, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setConversionResult(null);
    try {
      const info = await parse3mf(buffer);
      setPackageInfo(info);
      setRawBuffer(buffer);
      setFileName(name);

      // Build initial position array for 3D viewer
      updateGeometry(info, 'all');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse 3MF package.');
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
      processBuffer(buffer, '20mm_Calibration_Cube.3mf');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load sample 3MF.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeConversion = async () => {
    if (!rawBuffer) return;
    setIsLoading(true);
    try {
      const result = await convert3mfToStl(
        rawBuffer,
        selectedObjectId === 'all' ? undefined : selectedObjectId
      );
      setConversionResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Conversion failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadStl = () => {
    if (!conversionResult) return;
    const a = document.createElement('a');
    a.href = conversionResult.stlBlobUrl;
    a.download = conversionResult.filename;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
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
            id="threemf-to-stl-input"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Upload .3MF file to convert to .STL
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                100% in-browser memory conversion. Extracts mesh geometry from Bambu Studio, PrusaSlicer, or OrcaSlicer packages into standard binary STL.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label
                htmlFor="threemf-to-stl-input"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Select 3MF File</span>
              </label>

              <button
                type="button"
                onClick={loadSample}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Try Sample 3MF Cube</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Parsing 3MF model XML and packaging binary STL...</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Conversion Notice</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Conversion Workspace */}
      {packageInfo && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-3 py-0.5 rounded-full">
                  .3MF → .STL
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {packageInfo.title || fileName}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {packageInfo.objects.length} object(s) detected • {packageInfo.totalTriangles.toLocaleString()} facets • Units: <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{packageInfo.unit}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!conversionResult ? (
                <button
                  onClick={executeConversion}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Convert to STL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={downloadStl}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .STL</span>
                </button>
              )}

              <label
                htmlFor="threemf-to-stl-change"
                className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Change File</span>
                <input
                  type="file"
                  accept=".3mf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="threemf-to-stl-change"
                />
              </label>
            </div>
          </div>

          {/* Part Selection (if multi-object) */}
          {packageInfo.objects.length > 1 && (
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Object to Export:</span>
              <select
                value={selectedObjectId}
                onChange={(e) => handleObjectChange(e.target.value)}
                className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="all">All Objects Combined ({packageInfo.objects.length} parts)</option>
                {packageInfo.objects.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name} ({obj.triangleCount.toLocaleString()} triangles)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3D Model Interactive View */}
          {positions && (
            <ThreeDViewer
              positions={positions}
              title={packageInfo.title || fileName}
              triangleCount={
                selectedObjectId === 'all'
                  ? packageInfo.totalTriangles
                  : packageInfo.objects.find(o => o.id === selectedObjectId)?.triangleCount
              }
              height={480}
            />
          )}

          {/* Conversion Success & Loss Transparency Report */}
          {conversionResult && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      Converted Successfully: {conversionResult.exportedTriangleCount.toLocaleString()} Triangles
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Standardized IEEE 754 Binary STL ready for any 3D slicer (Bambu, Prusa, Cura, Lychee).
                    </p>
                  </div>
                </div>

                <button
                  onClick={downloadStl}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {conversionResult.filename}</span>
                </button>
              </div>

              {/* Technical Loss Transparency Box */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Technical Advisory: Information Preserved & Lost</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {conversionResult.lossWarnings.map((warning, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span>Related 3D Workflows:</span>
            <button
              onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'stl-viewer' })}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>STL Viewer & Dimensions</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate?.({ view: 'tool-detail', slug: '3mf-viewer' })}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>3MF Package Inspector</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate?.({ view: 'tool-detail', slug: 'stl-repair' })}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Repair STL Mesh</span>
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
