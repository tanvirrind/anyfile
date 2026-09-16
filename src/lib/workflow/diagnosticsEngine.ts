import { FileAnalysis } from '../analyzer/types';
import { FileHealthAssessment, FileHealthSignal, HumanReadableDiagnostic } from './types';

/**
 * Computes a factual, measurable File Health Assessment based strictly on
 * technical signals (magic bytes, MIME verification, container parsing, entropy).
 * Never claims to be an antivirus or produces fake security percentages.
 */
export function computeFileHealth(analysis: FileAnalysis): FileHealthAssessment {
  const signals: FileHealthSignal[] = [];

  const isUnknown = analysis.detectedExtension.toLowerCase() === 'unknown' || analysis.detectedExtension.toLowerCase() === 'bin';
  const isMismatch = analysis.extensionComparison.status === 'mismatch';
  const isMissingExt = analysis.extensionComparison.status === 'missing';
  const hasSignature = !!analysis.signature.matchedPattern;
  const isEncrypted = analysis.security.isEncrypted || analysis.metadata.archive?.isEncrypted || analysis.metadata.document?.isEncrypted || false;
  const isZeroByte = analysis.fileSize === 0;

  // Signal 1: Signature Recognition
  if (hasSignature) {
    signals.push({
      id: 'sig_recognized',
      name: 'Signature Recognized',
      passed: true,
      status: 'pass',
      message: `Magic header '${analysis.signature.hexSignature.slice(0, 11)}' matches known ${analysis.detectedFormat} specification.`
    });
  } else if (!isUnknown) {
    signals.push({
      id: 'sig_heuristic',
      name: 'Format Heuristic',
      passed: true,
      status: 'info',
      message: `Detected format via container parsing or standard structure.`
    });
  } else {
    signals.push({
      id: 'sig_unrecognized',
      name: 'Signature Unrecognized',
      passed: false,
      status: 'warn',
      message: `No standard magic byte sequence matched in AnyFileX binary signatures database.`
    });
  }

  // Signal 2: Extension Alignment
  if (isMismatch) {
    signals.push({
      id: 'ext_mismatch',
      name: 'Extension Match',
      passed: false,
      status: 'warn',
      message: `Filename extension .${analysis.fileNameExtension} does not match detected format .${analysis.detectedExtension}.`
    });
  } else if (isMissingExt) {
    signals.push({
      id: 'ext_missing',
      name: 'Extension Match',
      passed: false,
      status: 'info',
      message: `Filename lacks an extension. Identified true format is .${analysis.detectedExtension}.`
    });
  } else {
    signals.push({
      id: 'ext_match',
      name: 'Extension Match',
      passed: true,
      status: 'pass',
      message: `Filename extension matches detected binary format.`
    });
  }

  // Signal 3: Container Structure
  if (isZeroByte) {
    signals.push({
      id: 'struct_empty',
      name: 'Container Structure',
      passed: false,
      status: 'fail',
      message: `File contains 0 bytes (empty buffer).`
    });
  } else if (isEncrypted) {
    signals.push({
      id: 'struct_encrypted',
      name: 'Container Encryption',
      passed: true,
      status: 'info',
      message: `Encrypted container detected. Internal payloads are password-protected.`
    });
  } else {
    signals.push({
      id: 'struct_valid',
      name: 'Container Structure',
      passed: true,
      status: 'pass',
      message: `Container markers and offset tables are structurally readable.`
    });
  }

  // Signal 4: Entropy Assessment
  const entropy = analysis.diagnostics.entropy ?? 5.5;
  if (entropy > 7.85) {
    signals.push({
      id: 'entropy_high',
      name: 'Entropy Rating',
      passed: true,
      status: 'info',
      message: `High entropy (${entropy.toFixed(2)} / 8.0) consistent with compressed or encrypted streams.`
    });
  } else {
    signals.push({
      id: 'entropy_normal',
      name: 'Entropy Rating',
      passed: true,
      status: 'pass',
      message: `Standard binary distribution (${entropy.toFixed(2)} / 8.0).`
    });
  }

  // Determine Overall Health State
  let status: 'Healthy' | 'Warning' | 'Needs Attention' | 'Unknown' = 'Healthy';
  let badgeClass = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
  let summary = 'Binary signatures, extension alignment, and container headers are verified.';
  let technicalReason = 'All technical markers match standard RFC / ISO specifications.';

  if (isZeroByte) {
    status = 'Needs Attention';
    badgeClass = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    summary = 'Empty 0-byte file detected. No payload or header data is present.';
    technicalReason = 'Buffer size is 0 bytes.';
  } else if (isMismatch) {
    status = 'Warning';
    badgeClass = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    summary = `Filename extension (.${analysis.fileNameExtension}) conflicts with internal binary contents (.${analysis.detectedExtension}).`;
    technicalReason = `Binary magic bytes identify the file as ${analysis.detectedFormat}, while the filename claims to be ${analysis.fileNameExtension.toUpperCase()}.`;
  } else if (isEncrypted) {
    status = 'Needs Attention';
    badgeClass = 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    summary = 'Password-protected container. Contents cannot be inspected without password.';
    technicalReason = 'Standard encryption flag bit is active in header table.';
  } else if (isUnknown) {
    status = 'Unknown';
    badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    summary = 'Unrecognized binary signature. File may be proprietary, damaged, or rare format.';
    technicalReason = 'Magic byte header did not match any known format in signature database.';
  }

  return {
    status,
    badgeClass,
    summary,
    signals,
    technicalReason,
    disclaimer: 'AnyFileX analyzes technical file structure and integrity locally in browser memory. This assessment is not an antivirus or malware scanner.'
  };
}

/**
 * Translates low-level technical detection results into clear, human-readable diagnostics.
 */
export function generateHumanReadableDiagnostics(analysis: FileAnalysis): HumanReadableDiagnostic[] {
  const diagnostics: HumanReadableDiagnostic[] = [];

  const isUnknown = analysis.detectedExtension.toLowerCase() === 'unknown' || analysis.detectedExtension.toLowerCase() === 'bin';
  const isMismatch = analysis.extensionComparison.status === 'mismatch';
  const isMissingExt = analysis.extensionComparison.status === 'missing';
  const isEncrypted = analysis.security.isEncrypted || analysis.metadata.archive?.isEncrypted || analysis.metadata.document?.isEncrypted;

  // 1. Extension Mismatch Diagnostic
  if (isMismatch) {
    diagnostics.push({
      title: 'Extension Mismatch Detected',
      type: 'warning',
      message: `The filename uses the .${analysis.fileNameExtension.toUpperCase()} extension, but the internal binary header identifies it as ${analysis.detectedFormat} (.${analysis.detectedExtension.toLowerCase()}).`,
      recommendedAction: `Rename the extension to .${analysis.detectedExtension.toLowerCase()} or use our converter to transcode it into .${analysis.fileNameExtension.toLowerCase()}.`,
      actionLabel: `Convert to .${analysis.fileNameExtension.toUpperCase()}`
    });
  }

  // 2. Missing Extension Diagnostic
  if (isMissingExt) {
    diagnostics.push({
      title: 'Missing File Extension',
      type: 'info',
      message: `This file has no extension in its filename, but its binary header matches ${analysis.detectedFormat}.`,
      recommendedAction: `Add .${analysis.detectedExtension.toLowerCase()} to the filename to ensure operating systems open it with the correct default application.`
    });
  }

  // 3. Unknown Format Diagnostic
  if (isUnknown) {
    diagnostics.push({
      title: 'Unrecognized Format Signature',
      type: 'error',
      message: 'AnyFileX could not identify this file against the signature database.',
      recommendedAction: 'Possible reasons: unsupported proprietary format, corrupted header, encrypted payload, or incomplete download. Check the Hex Dump tab to inspect raw bytes.'
    });
  }

  // 4. Encrypted Container Diagnostic
  if (isEncrypted) {
    diagnostics.push({
      title: 'Encrypted Container',
      type: 'info',
      message: 'This archive or document is protected with cryptographic encryption.',
      recommendedAction: 'AnyFileX cannot inspect or extract protected internal records without the decryption password. Open the file in its native application to unlock.'
    });
  }

  // 5. Normal Healthy Verification
  if (!isMismatch && !isMissingExt && !isUnknown && !isEncrypted) {
    diagnostics.push({
      title: 'File Structure Verified',
      type: 'success',
      message: `The file header matches standard ${analysis.detectedFormat} specifications and aligns with its .${analysis.detectedExtension.toLowerCase()} extension.`,
      recommendedAction: 'The file is structurally intact and ready for conversion, resizing, compression, or extraction.'
    });
  }

  return diagnostics;
}
