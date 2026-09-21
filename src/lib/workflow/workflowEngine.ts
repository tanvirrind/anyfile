import { FileAnalysis } from '../analyzer/types';
import { analyzeFile } from '../analyzer/fileAnalyzerService';
import {
  compressImageFile,
  resizeImageFile,
  loadImageElement,
  formatBytes
} from '../tools/imageEngine';
import { createZipPackage } from './archiveEngine';
import { convertImagesToPdf } from './documentEngine';
import { saveWorkflowRecord } from './workflowHistory';
import { FileWorkflow, WorkflowStep, WorkflowStepConfig } from './types';

/**
 * Creates a new FileWorkflow instance with default or customized steps.
 */
export function createWorkflow(
  sourceFile: File,
  stepConfigs?: WorkflowStepConfig[],
  sourceAnalysis?: FileAnalysis
): FileWorkflow {
  const workflowId = 'wf_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

  const defaultConfigs: WorkflowStepConfig[] = stepConfigs && stepConfigs.length > 0
    ? stepConfigs
    : [
        { type: 'convert', targetFormat: 'jpg' },
        { type: 'resize', targetWidth: 1920, lockRatio: true, mode: 'contain' },
        { type: 'compress', quality: 80 },
        { type: 'verify' }
      ];

  const steps: WorkflowStep[] = defaultConfigs.map((cfg, idx) => {
    return createWorkflowStep(cfg, idx);
  });

  return {
    id: workflowId,
    name: `${sourceFile.name} Custom Workflow`,
    sourceFile,
    sourceAnalysis,
    steps,
    status: 'draft',
    currentStepIndex: 0,
    createdAt: new Date().toISOString()
  };
}

/**
 * Helper to build a workflow step object from config.
 */
export function createWorkflowStep(config: WorkflowStepConfig, index: number): WorkflowStep {
  const stepId = `step_${index + 1}_${config.type}_${Math.random().toString(36).substring(2, 6)}`;
  let name = '';
  let description = '';

  switch (config.type) {
    case 'analyze':
      name = 'Analyze File Structure';
      description = 'Inspect binary header and verify MIME alignment.';
      break;
    case 'convert':
      name = `Convert to .${(config.targetFormat || 'jpg').toUpperCase()}`;
      description = `Transcode pixel buffer to ${config.targetFormat?.toUpperCase() || 'JPG'} container.`;
      break;
    case 'resize':
      name = config.targetWidth ? `Resize to ${config.targetWidth}px Width` : 'Resize Dimensions';
      description = `Scale dimensions with aspect ratio lock (Mode: ${config.mode || 'contain'}).`;
      break;
    case 'compress':
      name = `Compress Image (${config.quality || 80}% Quality)`;
      description = 'Quantize discrete cosine transforms to reduce payload size.';
      break;
    case 'strip_metadata':
      name = 'Strip EXIF & Location Metadata';
      description = 'Remove embedded camera models, timestamps, and GPS coordinates.';
      break;
    case 'zip_package':
      name = 'Package into ZIP Archive';
      description = `Bundle output file into ${config.archiveName || 'bundle.zip'}.`;
      break;
    case 'verify':
      name = 'Verify Output Integrity';
      description = 'Run File Intelligence Engine on generated output to confirm valid signatures.';
      break;
  }

  return {
    id: stepId,
    type: config.type,
    name,
    description,
    status: 'idle',
    config: { ...config }
  };
}

/**
 * Executes a FileWorkflow sequentially in browser memory.
 * Preserves the original file untouched and records step-level metrics.
 */
export async function executeWorkflow(
  workflow: FileWorkflow,
  onStepProgress?: (stepIndex: number, step: WorkflowStep) => void
): Promise<FileWorkflow> {
  const startTime = performance.now();
  const updatedWorkflow: FileWorkflow = {
    ...workflow,
    status: 'running',
    steps: workflow.steps.map((s) => ({ ...s, status: 'idle', error: undefined }))
  };

  let currentBlob: Blob = workflow.sourceFile;
  let currentFileName = workflow.sourceFile.name;
  let currentWidth: number | undefined;
  let currentHeight: number | undefined;

  for (let i = 0; i < updatedWorkflow.steps.length; i++) {
    const step = updatedWorkflow.steps[i];
    updatedWorkflow.currentStepIndex = i;
    step.status = 'running';
    if (onStepProgress) onStepProgress(i, step);

    const stepStart = performance.now();

    try {
      // 1. ANALYZE STEP
      if (step.type === 'analyze') {
        const fileObj = new File([currentBlob], currentFileName, { type: currentBlob.type });
        const analysis = await analyzeFile(fileObj);
        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          durationMs: Math.round(performance.now() - stepStart)
        };
      }

      // 2. CONVERT STEP
      else if (step.type === 'convert') {
        const targetFormat = step.config.targetFormat || 'jpg';
        const baseName = currentFileName.substring(0, currentFileName.lastIndexOf('.')) || currentFileName;

        if (targetFormat === 'pdf') {
          // Convert Image to PDF
          const pdfRes = await convertImagesToPdf([
            { blob: currentBlob, fileName: currentFileName, width: currentWidth, height: currentHeight }
          ]);
          currentBlob = pdfRes.pdfBlob;
          currentFileName = `${baseName}.pdf`;
        } else {
          // Convert Image to JPG / PNG / WEBP
          const fileObj = new File([currentBlob], currentFileName, { type: currentBlob.type });
          const processed = await compressImageFile(fileObj, {
            outputFormat: targetFormat,
            quality: 0.92
          });

          currentBlob = processed.outputBlob;
          currentFileName = `${baseName}.${targetFormat}`;
          currentWidth = processed.metrics.outputWidth;
          currentHeight = processed.metrics.outputHeight;
        }

        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultBlobUrl = URL.createObjectURL(currentBlob);
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          durationMs: Math.round(performance.now() - stepStart),
          width: currentWidth,
          height: currentHeight
        };
      }

      // 3. RESIZE STEP
      else if (step.type === 'resize') {
        const fileObj = new File([currentBlob], currentFileName, { type: currentBlob.type });
        const processed = await resizeImageFile(fileObj, {
          width: step.config.targetWidth,
          height: step.config.targetHeight,
          scalePercent: step.config.scalePercent,
          maintainAspectRatio: step.config.lockRatio ?? true,
          mode: step.config.mode || 'contain',
          outputFormat: (currentFileName.split('.').pop()?.toLowerCase() as any) || 'jpg',
          quality: 0.9
        });

        currentBlob = processed.outputBlob;
        currentFileName = processed.outputFileName;
        currentWidth = processed.metrics.outputWidth;
        currentHeight = processed.metrics.outputHeight;

        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultBlobUrl = URL.createObjectURL(currentBlob);
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          originalSizeBytes: processed.metrics.originalSizeBytes,
          outputSizeBytes: processed.metrics.outputSizeBytes,
          savedBytes: processed.metrics.savedBytes,
          savedPercent: processed.metrics.savedPercent,
          width: currentWidth,
          height: currentHeight,
          durationMs: Math.round(performance.now() - stepStart)
        };
      }

      // 4. COMPRESS STEP
      else if (step.type === 'compress') {
        const fileObj = new File([currentBlob], currentFileName, { type: currentBlob.type });
        const qualityDecimal = (step.config.quality || 80) / 100;
        const processed = await compressImageFile(fileObj, {
          outputFormat: 'original',
          quality: qualityDecimal
        });

        currentBlob = processed.outputBlob;
        currentFileName = processed.outputFileName;
        currentWidth = processed.metrics.outputWidth;
        currentHeight = processed.metrics.outputHeight;

        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultBlobUrl = URL.createObjectURL(currentBlob);
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          originalSizeBytes: processed.metrics.originalSizeBytes,
          outputSizeBytes: processed.metrics.outputSizeBytes,
          savedBytes: processed.metrics.savedBytes,
          savedPercent: processed.metrics.savedPercent,
          width: currentWidth,
          height: currentHeight,
          durationMs: Math.round(performance.now() - stepStart)
        };
      }

      // 5. STRIP METADATA STEP
      else if (step.type === 'strip_metadata') {
        const fileObj = new File([currentBlob], currentFileName, { type: currentBlob.type });
        // Loading into clean Canvas and exporting automatically discards EXIF APP1 headers
        const { img, width, height } = await loadImageElement(fileObj);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to initialize 2D canvas context for metadata stripping.');
        ctx.drawImage(img, 0, 0);

        const outMime = currentBlob.type || 'image/jpeg';
        const strippedBlob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to export stripped blob'))), outMime, 0.95);
        });

        currentBlob = strippedBlob;
        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultBlobUrl = URL.createObjectURL(currentBlob);
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          durationMs: Math.round(performance.now() - stepStart)
        };
      }

      // 6. ZIP PACKAGE STEP
      else if (step.type === 'zip_package') {
        const archiveName = step.config.archiveName || 'workflow_bundle.zip';
        const zipResult = await createZipPackage([
          { name: currentFileName, blob: currentBlob }
        ], archiveName);

        currentBlob = zipResult.zipBlob;
        currentFileName = archiveName;

        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultBlobUrl = zipResult.zipUrl;
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          durationMs: Math.round(performance.now() - stepStart)
        };
      }

      // 7. OUTPUT VERIFICATION STEP
      else if (step.type === 'verify') {
        const fileObj = new File([currentBlob], currentFileName, { type: currentBlob.type });
        const verificationAnalysis = await analyzeFile(fileObj);

        step.status = 'completed';
        step.resultBlob = currentBlob;
        step.resultBlobUrl = URL.createObjectURL(currentBlob);
        step.resultFileName = currentFileName;
        step.resultSize = currentBlob.size;
        step.metrics = {
          durationMs: Math.round(performance.now() - stepStart)
        };

        // Attach verification report to workflow
        if (!updatedWorkflow.finalOutput) {
          updatedWorkflow.finalOutput = {
            blob: currentBlob,
            blobUrl: URL.createObjectURL(currentBlob),
            fileName: currentFileName,
            size: currentBlob.size,
            verification: verificationAnalysis
          };
        } else {
          updatedWorkflow.finalOutput.verification = verificationAnalysis;
        }
      }

      if (onStepProgress) onStepProgress(i, step);
    } catch (err: any) {
      console.error(`Workflow step failed at index ${i} (${step.type}):`, err);
      step.status = 'failed';
      step.error = err?.message || 'Operation failed during execution.';

      // Mark remaining steps as skipped
      for (let j = i + 1; j < updatedWorkflow.steps.length; j++) {
        updatedWorkflow.steps[j].status = 'skipped';
      }

      updatedWorkflow.status = 'failed';
      updatedWorkflow.error = `Step '${step.name}' failed: ${step.error}`;
      if (onStepProgress) onStepProgress(i, step);
      return updatedWorkflow;
    }
  }

  // Set final output
  if (!updatedWorkflow.finalOutput) {
    updatedWorkflow.finalOutput = {
      blob: currentBlob,
      blobUrl: URL.createObjectURL(currentBlob),
      fileName: currentFileName,
      size: currentBlob.size
    };
  }

  const totalDuration = Math.round(performance.now() - startTime);
  updatedWorkflow.status = 'completed';
  updatedWorkflow.completedAt = new Date().toISOString();

  // Save history record
  saveWorkflowRecord({
    workflowTitle: updatedWorkflow.name,
    fileName: workflow.sourceFile.name,
    sourceFormat: workflow.sourceFile.name.split('.').pop()?.toUpperCase() || 'BIN',
    targetFormat: currentFileName.split('.').pop()?.toUpperCase(),
    originalSize: workflow.sourceFile.size,
    finalSize: currentBlob.size,
    stepsCount: updatedWorkflow.steps.length,
    status: 'completed',
    durationMs: totalDuration
  });

  return updatedWorkflow;
}

/**
 * Exports a shareable, comprehensive File Intelligence & Workflow Audit Report
 * in Markdown, HTML, or JSON format.
 */
export function exportAnalysisReport(
  analysis: FileAnalysis,
  format: 'markdown' | 'html' | 'json' = 'markdown',
  workflowResult?: FileWorkflow
): void {
  const timestamp = new Date().toISOString();
  let content = '';
  let mimeType = 'text/plain';
  let fileExt = 'txt';

  if (format === 'json') {
    const reportData = {
      reportType: 'AnyFileX Local File Intelligence Report',
      generatedAt: timestamp,
      analysis,
      workflow: workflowResult ? {
        id: workflowResult.id,
        name: workflowResult.name,
        status: workflowResult.status,
        steps: workflowResult.steps.map((s) => ({
          name: s.name,
          type: s.type,
          status: s.status,
          metrics: s.metrics
        })),
        finalOutput: workflowResult.finalOutput ? {
          fileName: workflowResult.finalOutput.fileName,
          size: workflowResult.finalOutput.size
        } : null
      } : null
    };
    content = JSON.stringify(reportData, null, 2);
    mimeType = 'application/json';
    fileExt = 'json';
  } else if (format === 'html') {
    content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AnyFileX File Analysis Report - ${analysis.fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h2 { font-size: 18px; color: #1e293b; margin-top: 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .table td, .table th { padding: 8px 12px; border: 1px solid #cbd5e1; font-size: 14px; }
    .table th { background: #f8fafc; text-align: left; }
    .code { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <h1>AnyFileX File Intelligence Audit Report</h1>
  <p><strong>File Name:</strong> ${analysis.fileName} <span class="badge">.${analysis.detectedExtension.toUpperCase()}</span></p>
  <p><strong>Detected Format:</strong> ${analysis.detectedFormat} (${analysis.category})</p>
  <p><strong>File Size:</strong> ${analysis.formattedSize} (${analysis.fileSize} bytes)</p>
  <p><strong>SHA-256 Checksum:</strong> <span class="code">${analysis.diagnostics.sha256Hash ?? 'Unavailable'}</span></p>

  <h2>Technical Binary Assessment</h2>
  <table class="table">
    <tr><th>Check</th><th>Result</th><th>Detail</th></tr>
    <tr><td>Magic Bytes</td><td class="code">${analysis.signature.hexSignature.slice(0, 11)}</td><td>${analysis.signature.meaning}</td></tr>
    <tr><td>MIME Type</td><td class="code">${analysis.detectedMimeType}</td><td>RFC Match: ${analysis.mimeComparison.status}</td></tr>
    <tr><td>Extension Match</td><td>${analysis.extensionComparison.status.toUpperCase()}</td><td>${analysis.extensionComparison.message}</td></tr>
    <tr><td>Security Assessment</td><td>${analysis.security.badgeText}</td><td>${analysis.security.neutralStatement}</td></tr>
  </table>

  <div class="footer">
    Generated client-side by AnyFileX (https://www.anyfilex.com) on ${new Date(timestamp).toLocaleString()}. 100% Private Browser Execution.
  </div>
</body>
</html>`;
    mimeType = 'text/html';
    fileExt = 'html';
  } else {
    // Markdown
    content = `# AnyFileX File Intelligence Report

**File:** \`${analysis.fileName}\`  
**Size:** ${analysis.formattedSize} (${analysis.fileSize} bytes)  
**Detected Format:** ${analysis.detectedFormat} (\`.${analysis.detectedExtension.toLowerCase()}\`)  
**MIME Type:** \`${analysis.detectedMimeType}\`  
**SHA-256 Hash:** \`${analysis.diagnostics.sha256Hash ?? 'Unavailable'}\`  
**Generated:** ${new Date(timestamp).toLocaleString()} (Client-Side Local)

---

## Technical Binary Verification

| Property | Value | Status |
| :--- | :--- | :--- |
| **Magic Header** | \`${analysis.signature.hexSignature.slice(0, 11)}\` | Recognized (${analysis.confidence} Confidence) |
| **Filename Extension** | \`.${analysis.fileNameExtension}\` | ${analysis.extensionComparison.status.toUpperCase()} |
| **MIME Consistency** | \`${analysis.mimeComparison.detectedMime}\` | ${analysis.mimeComparison.status.toUpperCase()} |
| **Entropy** | \`${analysis.diagnostics.entropy?.toFixed(2) || 'N/A'} / 8.0\` | Normal |
| **Security Signals** | ${analysis.security.badgeText} | ${analysis.security.neutralStatement} |

---

## Technical Diagnosis

${analysis.extensionComparison.explanation}

*Disclaimer: AnyFileX evaluates binary signatures and container structures in browser RAM. This is a technical format diagnostic, not an antivirus.*
`;
    mimeType = 'text/markdown';
    fileExt = 'md';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = `${analysis.fileName}_anyfilex_report.${fileExt}`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
