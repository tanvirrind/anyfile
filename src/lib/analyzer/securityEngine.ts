import {
  ExtensionComparisonResult,
  MimeComparisonResult,
  SecurityAssessment,
  SecurityIndicatorItem,
} from './types';

/**
 * Computes Shannon Entropy (0.0 to 8.0) of a byte sample.
 * Higher values (> 7.5) indicate high-density compression or strong AES encryption.
 */
export function calculateShannonEntropy(bytes: Uint8Array): number {
  if (bytes.length === 0) return 0;
  const frequencies = new Array(256).fill(0);

  for (let i = 0; i < bytes.length; i++) {
    frequencies[bytes[i]]++;
  }

  let entropy = 0;
  const length = bytes.length;

  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const p = frequencies[i] / length;
      entropy -= p * Math.log2(p);
    }
  }

  return parseFloat(entropy.toFixed(2));
}

/**
 * Assesses file integrity, format risks, and security indicators using neutral, factual technical language.
 */
export function evaluateSecurity(
  detectedExt: string,
  category: string,
  extensionComparison: ExtensionComparisonResult,
  mimeComparison: MimeComparisonResult,
  bytes: Uint8Array,
  fileName: string
): SecurityAssessment {
  const indicators: SecurityIndicatorItem[] = [];
  const upperExt = detectedExt.toUpperCase();
  const lowerName = fileName.toLowerCase();

  const isExecutable = ['EXE', 'DLL', 'ELF', 'APK', 'SYS', 'BAT', 'CMD', 'VBS', 'PS1'].includes(upperExt);
  const isArchive = category === 'Archives' || ['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(upperExt);
  const isOffice = ['DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX'].includes(upperExt);

  // Check double extension spoofing (e.g. document.pdf.exe or invoice.docx.js)
  const dotParts = fileName.split('.').filter(Boolean);
  const hasDoubleExtension = dotParts.length > 2 && isExecutable;

  // Check Macro flags in Office streams
  const ascii = Array.from(bytes.slice(0, Math.min(bytes.length, 512)))
    .map((b) => String.fromCharCode(b))
    .join('');
  const isMacroEnabled =
    upperExt === 'DOCM' ||
    upperExt === 'XLSM' ||
    upperExt === 'PPTM' ||
    ascii.includes('vbaProject.bin') ||
    ascii.includes('Macros');

  // Check encrypted PDF / Archive flags
  const isEncrypted = ascii.includes('/Encrypt') || ascii.includes('WinZipAES');

  // Compute Shannon Entropy
  const entropy = calculateShannonEntropy(bytes);

  // 1. Extension Mismatch Check
  if (extensionComparison.status === 'mismatch') {
    indicators.push({
      id: 'ext_mismatch',
      type: extensionComparison.isSpoofed ? 'danger' : 'warning',
      title: 'Extension / Content Mismatch',
      description: `Filename ends in "${extensionComparison.filenameExtension}", but internal binary magic headers identify "${extensionComparison.detectedExtension}".`,
    });
  } else if (extensionComparison.status === 'missing') {
    indicators.push({
      id: 'ext_missing',
      type: 'info',
      title: 'Missing File Extension',
      description: `The file has no extension in its name. Internal header inspection resolved it as ${extensionComparison.detectedExtension}.`,
    });
  } else {
    indicators.push({
      id: 'ext_ok',
      type: 'info',
      title: 'Format Signature Alignment',
      description: 'The filename extension perfectly matches the detected binary header specification.',
    });
  }

  // 2. Executable Code Indicator
  if (isExecutable) {
    indicators.push({
      id: 'executable_binary',
      type: 'caution',
      title: 'Executable Machine Binary Format',
      description: 'Contains compiled native machine bytecode (PE/ELF). Exercise caution before executing binaries from unknown sources.',
    });
  }

  // 3. Double Extension Spoofing Indicator
  if (hasDoubleExtension) {
    indicators.push({
      id: 'double_extension',
      type: 'danger',
      title: 'Suspicious Multi-Part Extension Detected',
      description: `The file name "${fileName}" contains multiple extension dots ending in an executable format.`,
    });
  }

  // 4. Macro-Enabled Document
  if (isMacroEnabled) {
    indicators.push({
      id: 'macro_enabled',
      type: 'caution',
      title: 'Macro-Enabled Document Package',
      description: 'Contains embedded VBA macro automation scripts. Ensure macros are only enabled from trusted publishers.',
    });
  }

  // 5. Encrypted Stream Indicator
  if (isEncrypted) {
    indicators.push({
      id: 'encrypted_container',
      type: 'info',
      title: 'Encrypted / Password Protected Container',
      description: 'The file header contains cryptographic security tags indicating payload password encryption.',
    });
  }

  // 6. Entropy Indicator
  if (entropy > 7.7) {
    indicators.push({
      id: 'high_entropy',
      type: 'info',
      title: `High Shannon Entropy (${entropy}/8.0)`,
      description: 'Binary data exhibits high randomness, consistent with strong compression (Deflate/LZMA) or encryption.',
    });
  }

  // Determine overall status & neutral statement
  let status: 'safe' | 'caution' | 'warning' = 'safe';
  let badgeText = 'No Mismatches Detected';

  if (extensionComparison.isSpoofed || hasDoubleExtension) {
    status = 'warning';
    badgeText = 'Extension Discrepancy';
  } else if (extensionComparison.status === 'mismatch') {
    status = 'warning';
    badgeText = 'Extension Mismatch';
  } else if (isExecutable || isMacroEnabled) {
    status = 'caution';
    badgeText = 'Executable / Macro Format';
  } else {
    status = 'safe';
    badgeText = 'Standard Format Alignment';
  }

  const neutralStatement =
    status === 'safe'
      ? 'No known file-type mismatch or suspicious header flags detected.'
      : 'File header inspection detected structural or extension discrepancies. The analyzer is not an antivirus software; it inspects file structure and header integrity.';

  return {
    status,
    badgeText,
    neutralStatement,
    indicators,
    isExecutable,
    isMacroEnabled,
    isEncrypted,
    isSpoofed: extensionComparison.isSpoofed || hasDoubleExtension,
    entropy,
  };
}
