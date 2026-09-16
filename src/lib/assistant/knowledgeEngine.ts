import { POPULAR_FILE_TYPES } from '../../data/fileTypesData';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { REPAIR_GUIDES } from '../../data/repairData';
import { AppRoute } from '../../types';

export interface ActionLink {
  type: 'extension' | 'software' | 'converter' | 'repair' | 'tool';
  label: string;
  badgeText: string;
  route: AppRoute;
  description?: string;
}

export interface AssistantAnalysisResult {
  text: string;
  suggestedActions: ActionLink[];
}

/**
 * Build rich system prompt context for Gemini incorporating database items.
 */
export function buildDatabaseContext(): string {
  const extensionsSummary = POPULAR_FILE_TYPES.map(
    (item) =>
      `-[.${item.extension}] ${item.name} (${item.category}): ${item.description} | Danger: ${item.dangerRating} | Apps: ${item.popularApps.map((a) => a.name).join(', ')} | Conversions: ${item.conversions.map((c) => c.targetExtension).join(', ')}`
  ).join('\n');

  const softwareSummary = SOFTWARE_LIST.map(
    (s) =>
      `-[${s.name}] Developer: ${s.developer} | OS: ${s.supportedOS.join(', ')} | Price: ${s.priceType} | Exts: ${s.supportedExtensions.join(', ')}`
  ).join('\n');

  const convertersSummary = CONVERTERS_LIST.map(
    (c) =>
      `-[${c.name}] (${c.fromExt} -> ${c.toExt}): ${c.description} | ID: ${c.id}`
  ).join('\n');

  const repairSummary = REPAIR_GUIDES.map(
    (r) =>
      `-[${r.title}] (${r.extension}): Symptoms: ${r.symptoms.join('; ')} | ID: ${r.id}`
  ).join('\n');

  return `
You are the OpenAnyFile AI Assistant — a specialized, highly knowledgeable SaaS assistant for digital file formats, software recommendations, file conversion pipelines, corrupted file repair, and file security analysis.

OPENANYFILE DATABASE CONTEXT:

FILE EXTENSIONS IN DATABASE:
${extensionsSummary}

SOFTWARE IN DATABASE:
${softwareSummary}

CONVERTERS AVAILABLE IN DATABASE:
${convertersSummary}

REPAIR GUIDES AVAILABLE IN DATABASE:
${repairSummary}

AVAILABLE INTERNAL TOOLS ON OPENANYFILE:
- File Identifier (/tools/file-identifier): Identifies unknown files using magic bytes, headers, and signatures.
- Metadata Inspector (/tools/metadata-viewer): Inspects EXIF, ID3, PDF, video metadata.
- Metadata Cleaner (/tools/remove-metadata): Strips GPS, author, camera serial numbers for privacy.
- Hash Generator (/tools/hash-generator): Generates SHA-256, MD5, SHA-1 checksums.
- Checksum Verifier (/tools/checksum-verifier): Compares file hash against expected checksum.
- MIME Type Checker (/tools/mime-checker): Look up Content-Type headers, RFC specifications, and HTTP headers.
- Magic Byte Detector (/tools/magic-byte-detector): Inspect raw binary signatures to detect file spoofing.
- File Converters (/converters): Client-side 100% private in-browser file converter.
- File Repair (/repair): Repair guides for corrupted archives, images, documents, and CAD files.

INSTRUCTIONS:
1. Provide concise, clear, accurate, and helpful answers.
2. Structure your response using clean Markdown with bolding, bullet points, and steps where appropriate.
3. Explicitly mention file extensions (e.g. .DWG, .HEIC, .PSD, .PDF, .ZIP), software (e.g. AutoCAD, Photoshop, GIMP, VLC), converters (e.g. HEIC to JPG), or tools (e.g. File Identifier) so the UI can automatically generate quick interactive action cards for the user!
4. If a user asks whether a file is safe, evaluate risks (e.g. executable vs container vs macro-enabled), mention magic bytes, and suggest using OpenAnyFile File Identifier or Magic Byte Detector.
5. Keep your tone professional, friendly, and expert.
`;
}

/**
 * Extract interactive action links based on response text or user query.
 */
export function extractSuggestedActions(
  userQuery: string,
  responseText: string
): ActionLink[] {
  const actions: ActionLink[] = [];
  const textToScan = `${userQuery} ${responseText}`.toLowerCase();

  // Check file extensions
  POPULAR_FILE_TYPES.forEach((item) => {
    const extMatch = new RegExp(`\\b(${item.extension.toLowerCase()})\\b`, 'i');
    if (extMatch.test(textToScan)) {
      if (!actions.some((a) => a.type === 'extension' && a.label === item.extension)) {
        actions.push({
          type: 'extension',
          label: item.extension,
          badgeText: `.${item.extension} File Specs`,
          route: { view: 'extension-detail', ext: item.extension.toLowerCase() },
          description: item.name,
        });
      }
    }
  });

  // Check software
  SOFTWARE_LIST.forEach((soft) => {
    if (textToScan.includes(soft.name.toLowerCase())) {
      if (!actions.some((a) => a.type === 'software' && a.label === soft.name)) {
        actions.push({
          type: 'software',
          label: soft.name,
          badgeText: `${soft.name} Info`,
          route: { view: 'software-detail', id: soft.id },
          description: `${soft.developer} • ${soft.priceType}`,
        });
      }
    }
  });

  // Check converters
  CONVERTERS_LIST.forEach((conv) => {
    if (
      textToScan.includes(conv.name.toLowerCase()) ||
      (textToScan.includes(conv.fromExt.toLowerCase()) && textToScan.includes(conv.toExt.toLowerCase()))
    ) {
      if (!actions.some((a) => a.type === 'converter' && a.label === conv.name)) {
        actions.push({
          type: 'converter',
          label: conv.name,
          badgeText: `Launch ${conv.fromExt} → ${conv.toExt}`,
          route: { view: 'converter-detail', id: conv.id },
          description: conv.description,
        });
      }
    }
  });

  // Check repair guides
  REPAIR_GUIDES.forEach((rep) => {
    if (
      textToScan.includes(rep.title.toLowerCase()) ||
      (textToScan.includes('repair') && textToScan.includes(rep.extension.toLowerCase()))
    ) {
      if (!actions.some((a) => a.type === 'repair' && a.label === rep.title)) {
        actions.push({
          type: 'repair',
          label: rep.title,
          badgeText: `${rep.extension} Repair Guide`,
          route: { view: 'repair-detail', id: rep.id },
          description: rep.title,
        });
      }
    }
  });

  // Check tools
  if (textToScan.includes('identify') || textToScan.includes('unknown file') || textToScan.includes('magic byte')) {
    actions.push({
      type: 'tool',
      label: 'File Identifier',
      badgeText: 'Open File Identifier',
      route: { view: 'file-identifier' },
      description: 'Analyze file headers and magic bytes',
    });
  }

  if (textToScan.includes('metadata') || textToScan.includes('exif') || textToScan.includes('gps')) {
    actions.push({
      type: 'tool',
      label: 'Metadata Inspector',
      badgeText: 'Open Metadata Inspector',
      route: { view: 'metadata-viewer' },
      description: 'Inspect EXIF, ID3, and document tags',
    });
  }

  if (textToScan.includes('hash') || textToScan.includes('sha256') || textToScan.includes('checksum')) {
    actions.push({
      type: 'tool',
      label: 'Hash Generator',
      badgeText: 'Open Hash Generator',
      route: { view: 'hash-generator' },
      description: 'Calculate cryptographic file hashes',
    });
  }

  // Cap actions to top 5
  return actions.slice(0, 5);
}

/**
 * Intelligent client/server fallback knowledge response generator.
 */
export function generateLocalFallbackResponse(prompt: string): AssistantAnalysisResult {
  const query = prompt.trim().toLowerCase();

  // DWG query
  if (query.includes('dwg')) {
    const text = `### Opening DWG Files (.dwg)
**DWG (DraWinG)** is the binary CAD format created by Autodesk for 2D and 3D design drafts.

#### Recommended Free & Paid Applications:
- **Autodesk DWG TrueView** (Windows • Free): Official viewer from Autodesk to open, measure, and convert DWG files.
- **AutoCAD / AutoCAD Web** (Windows, Mac, Web • Paid / Free Trial): Complete drafting suite.
- **LibreCAD** (Windows, Mac, Linux • Open Source): Free 2D CAD drafting tool.
- **FreeCAD** (Windows, Mac, Linux • Open Source): Parametric 3D modeler with DWG import plugins.

#### Quick Actions & Conversion:
You can convert DWG drawings to PDF or DXF for easy viewing on any device without specialized CAD software.`;
    return {
      text,
      suggestedActions: extractSuggestedActions(prompt, text),
    };
  }

  // HEIC query
  if (query.includes('heic')) {
    const text = `### HEIC File Conversion & Opening Guide
**HEIC (High Efficiency Image Container)** is Apple's high-efficiency photo format used on iPhones and iPads.

#### How to Convert HEIC to JPG:
1. Go to our **HEIC → JPG Converter** on OpenAnyFile.
2. Drag and drop your \`.heic\` photos directly into the browser converter box.
3. Your photos are converted **100% locally in your browser** with zero quality loss and instant batch downloading!

#### Native Support:
- **Windows 11/10**: Install the free *HEIF Image Extensions* from Microsoft Store, or use OpenAnyFile Web Converter.
- **Mac / iOS**: Double-click to view natively in Preview or Photos.`;
    return {
      text,
      suggestedActions: extractSuggestedActions(prompt, text),
    };
  }

  // Is file safe query
  if (query.includes('safe') || query.includes('virus') || query.includes('danger')) {
    const text = `### File Safety & Risk Assessment Checklist
When evaluating whether a file is safe to open, follow these verification steps:

1. **Check the File Extension:**
   - **Low Risk**: Images (\`.jpg\`, \`.png\`, \`.heic\`), Audio (\`.mp3\`, \`.wav\`).
   - **Medium Risk**: Archives (\`.zip\`, \`.rar\`), Documents with macros (\`.docm\`, \`.xlsm\`).
   - **High Risk**: Executables and scripts (\`.exe\`, \`.bat\`, \`.vbs\`, \`.ps1\`, \`.scr\`).

2. **Detect Double Extension Spoofing:**
   Hackers often name malicious files like \`invoice.pdf.exe\`. Ensure your operating system shows file extensions.

3. **Verify Magic Bytes:**
   Run the file through our **Magic Byte Detector** to confirm the binary signature matches the extension. If a file claims to be a \`.pdf\` but starts with \`MZ\` (Windows Executable), it is a spoofed virus!`;
    return {
      text,
      suggestedActions: extractSuggestedActions(prompt, text),
    };
  }

  // PSD query
  if (query.includes('psd')) {
    const text = `### What is a PSD File? (.psd)
**PSD (Photoshop Document)** is the native layered image file format created by Adobe Photoshop.

#### Key Features:
- Supports multiple adjustment layers, vector paths, text layers, masks, and blend modes.
- Uncompressed or losslessly compressed graphics up to 2 GB in size.

#### Free Software to Open PSD Files:
- **GIMP** (Windows, Mac, Linux • Free & Open Source): Full PSD layer support.
- **Photopea** (Browser-based • Free): Web app that replicates Photoshop interface.
- **Krita** (Windows, Mac, Linux • Free): Digital painting tool with PSD import capabilities.`;
    return {
      text,
      suggestedActions: extractSuggestedActions(prompt, text),
    };
  }

  // Repair query
  if (query.includes('repair') || query.includes('corrupt')) {
    const text = `### Corrupted File Recovery & Repair
If a file refuses to open or displays a "Format Not Supported / Corrupted Header" error:

1. **Check Magic Bytes:** Inspect whether the file header was truncated or corrupted during download.
2. **Use Built-in Repair Tools:**
   - For **ZIP/RAR**: Use WinRAR's *Repair Archive* tool.
   - For **PDF**: Use Ghostscript or PDF repair commands.
   - For **Media files**: Use VLC Media Player's automatic AVI/MP4 index repair.
3. **Explore OpenAnyFile Repair Guides:** We feature detailed, step-by-step repair manuals for ZIP, PDF, JPEG, MP4, and DWG files!`;
    return {
      text,
      suggestedActions: extractSuggestedActions(prompt, text),
    };
  }

  // Generic fallback
  const matchedExts = POPULAR_FILE_TYPES.filter((f) =>
    query.includes(f.extension.toLowerCase()) || query.includes(f.name.toLowerCase())
  );

  if (matchedExts.length > 0) {
    const ext = matchedExts[0];
    const text = `### Info for .${ext.extension} (${ext.name})
- **Category**: ${ext.category}
- **Description**: ${ext.description}
- **Safety Rating**: ${ext.dangerRating} — ${ext.dangerExplanation}
- **Typical Size**: ${ext.typicalSize}

#### Opening Software:
${ext.popularApps.map((a) => `- **${a.name}** (${a.os.join(', ')}) — ${a.isFree ? 'Free' : 'Paid'}`).join('\n')}

#### Available Conversions:
${ext.conversions.map((c) => `- Convert .${ext.extension} to **.${c.targetExtension}** (${c.description})`).join('\n')}`;
    return {
      text,
      suggestedActions: extractSuggestedActions(prompt, text),
    };
  }

  const defaultText = `### OpenAnyFile AI File Assistant
I can help you analyze, open, convert, and secure any digital file format!

**Here is how I can assist you:**
- **Explain File Formats**: Learn what any file extension stands for, its structure, and magic byte signatures.
- **Software Recommendations**: Find free, open-source, or commercial programs for Windows, Mac, Linux, iOS, and Android.
- **Converter Guidance**: Find direct in-browser conversion pathways for images, documents, CAD, and audio.
- **File Safety Analysis**: Detect executable spoofing, risk ratings, and hidden tracking metadata.
- **File Repair**: Step-by-step instructions to recover corrupted headers and broken archives.

Feel free to ask a specific question or upload a file for analysis!`;

  return {
    text: defaultText,
    suggestedActions: extractSuggestedActions(prompt, defaultText),
  };
}
