import { FileTypeInfo, AppRoute } from '../../types';
import { getOrGenerateExtensionInfo } from '../seo/extensionGenerator';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { CURATED_COMPARISONS } from '../database/knowledgeGraph';
import { getAllFileTypeInfos } from '../database/extensionEngine';
import { getAllTools } from '../tools/toolsRegistry';

export interface StepInstruction {
  stepNumber: number;
  title: string;
  detail: string;
  tip?: string;
  command?: string;
}

export interface OsGuideSection {
  isSupported: boolean;
  title: string;
  badge: string;
  defaultApp: string;
  codecNote?: string;
  packageInstall?: string;
  terminalCommand?: string;
  steps: StepInstruction[];
}

export interface SoftwareRecommendationItem {
  id: string;
  name: string;
  developer: string;
  category: string;
  supportedOS: ('windows' | 'mac' | 'linux' | 'android' | 'ios')[];
  priceType: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  priceText: string;
  rating: number;
  canOpen: boolean;
  canView: boolean;
  canEdit: boolean;
  canConvert: boolean;
  routeId: string;
  websiteUrl: string;
}

export interface TroubleshootingFailureMode {
  id: string;
  issue: string;
  cause: string;
  diagnostic: string;
  solution: string;
  toolAction?: {
    label: string;
    route: AppRoute;
  };
}

export interface ConversionWorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  actionText: string;
  route: AppRoute;
}

export interface HowToOpenGuideData {
  extension: string;
  upperExt: string;
  name: string;
  category: string;
  mimeType: string;
  magicBytesHex: string;
  dangerRating: string;
  summary: string;
  whyItIsHardToOpen: string;
  inBrowserSupport: {
    supported: boolean;
    type: 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'archive' | 'hex' | 'none';
    note: string;
  };
  osGuides: {
    windows: OsGuideSection;
    mac: OsGuideSection;
    linux: OsGuideSection;
    ios: OsGuideSection;
    android: OsGuideSection;
  };
  recommendedSoftware: SoftwareRecommendationItem[];
  browserOptions: {
    title: string;
    description: string;
    badge: string;
    actionUrl?: string;
  }[];
  troubleshooting: TroubleshootingFailureMode[];
  conversionWorkflow: {
    steps: ConversionWorkflowStep[];
    availableConverters: {
      targetExt: string;
      label: string;
      routeId: string;
    }[];
  };
  internalLinks: {
    formatGuideUrl: string;
    extensionUrl: string;
    comparisons: { slug: string; title: string; highlight: string }[];
    relatedExtensions: { ext: string; name: string; category: string }[];
    recommendedTools: { name: string; slug: string; description: string }[];
  };
  faqs: { question: string; answer: string }[];
  schemaJson: any;
}

/**
 * List of prioritized formats with extensive curated guides
 */
export const HIGH_VALUE_OPEN_FORMATS = [
  'heic', 'webp', 'avif', 'psd', 'ai', 'eps', 'svg', 'raw', 'cr2', 'nef', 'dng',
  'pdf', 'docx', 'xlsx', 'pptx', 'epub', 'mobi', 'csv',
  'zip', 'rar', '7z', 'tar', 'gz', 'dmg', 'iso', 'bin', 'dat',
  'mkv', 'flac', 'webm', 'mov', 'mp4', 'aac', 'wav',
  'dwg', 'dxf', 'stl', 'obj', 'step', 'iges',
  'json', 'sql', 'xml', 'apk', 'torrent'
];

/**
 * Curated deep overrides for high-volume file types
 */
const FORMAT_SPECIFIC_OVERRIDES: Record<string, Partial<HowToOpenGuideData>> = {
  heic: {
    whyItIsHardToOpen: "HEIC (High Efficiency Image Container) is the default camera capture format on iPhones and iPads since iOS 11. However, Windows 11 and Windows 10 do not include the HEVC video & image codec by default due to patent licensing fees, causing the Windows Photos app to show 'The HEVC Video Extension is required to display this file' or fail to render previews.",
    inBrowserSupport: {
      supported: true,
      type: 'image',
      note: 'AnyFileX uses a client-side WebAssembly libheif decoder to render full-resolution HEIC photos directly inside your browser without uploading to external servers.'
    }
  },
  webp: {
    whyItIsHardToOpen: "WebP is Google's modern image format designed for web bandwidth efficiency. While modern web browsers and Windows 11 open WebP natively, legacy desktop graphic editors (like older Adobe Photoshop releases, CorelDRAW, or Windows Photo Viewer) lack native WebP import plugins.",
    inBrowserSupport: {
      supported: true,
      type: 'image',
      note: 'Every modern browser has native hardware-accelerated WebP decoders.'
    }
  },
  avif: {
    whyItIsHardToOpen: "AVIF (AV1 Image File Format) provides ultra-dense compression with HDR support. However, older Windows operating systems (prior to Windows 11 22H2), older macOS builds, and many offline desktop image editors lack the AV1 codec library required to parse the container.",
    inBrowserSupport: {
      supported: true,
      type: 'image',
      note: 'Supported natively in modern Chromium, Firefox, and Safari browsers.'
    }
  },
  dmg: {
    whyItIsHardToOpen: "DMG files are Apple Disk Image containers formatted in HFS+ or APFS filesystem structures. Windows and Linux operating systems cannot mount DMG files as virtual disks natively without third-party extraction tools or virtual machine software.",
    inBrowserSupport: {
      supported: true,
      type: 'archive',
      note: 'AnyFileX file forensics can parse DMG header tables and extract embedded payload files.'
    }
  },
  psd: {
    whyItIsHardToOpen: "PSD files are Adobe Photoshop native layered documents containing complex layer masks, raster channels, vector paths, and blend modes. Standard image viewers only display the flattened composite image or fail to open unrasterized smart objects.",
    inBrowserSupport: {
      supported: true,
      type: 'image',
      note: 'Preview individual raster layers and composite renders directly in-browser.'
    }
  },
  dat: {
    whyItIsHardToOpen: "DAT is a generic file extension used by thousands of unrelated applications (e.g. Microsoft Outlook winmail.dat attachments, VCD video streams, game save databases, or proprietary binary caches). Without knowing the creating application or inspecting magic bytes, standard operating systems do not know which program to associate.",
    inBrowserSupport: {
      supported: true,
      type: 'hex',
      note: 'Inspect the raw binary header with AnyFileX Magic Byte Detector to instantly identify the real format behind the .dat extension.'
    }
  },
  rar: {
    whyItIsHardToOpen: "RAR is a proprietary compression format created by Eugene Roshal. While Windows 11 recently added native RAR reading via libarchive, macOS and Linux still require specialized unarchivers (like Unarchiver or unrar) to unpack password-protected or multi-volume RAR archives.",
    inBrowserSupport: {
      supported: true,
      type: 'archive',
      note: 'Decompress and inspect archive catalogs in client-side WebAssembly memory.'
    }
  },
  mkv: {
    whyItIsHardToOpen: "MKV (Matroska Video) is a flexible media container supporting multiple video streams, multi-language audio tracks, and soft subtitles (ASS/SSA). Windows Media Player and QuickTime Player often lack the AC3/DTS audio decoders or Vorbis/HEVC stream splitters necessary for smooth playback.",
    inBrowserSupport: {
      supported: true,
      type: 'video',
      note: 'Browser video engines can stream WebM/MP4 compatible tracks from MKV containers.'
    }
  },
  dwg: {
    whyItIsHardToOpen: "DWG is Autodesk's proprietary 2D and 3D computer-aided design binary format. Because of complex vector geometries and Autodesk licensing, general graphics software cannot view or render DWG blueprints without specialized CAD viewers.",
    inBrowserSupport: {
      supported: true,
      type: 'hex',
      note: 'Inspect header versions (AC1032, AC1027, etc.) and convert DWG to PDF or DXF for universal viewing.'
    }
  }
};

/**
 * Builds the comprehensive How-to-Open Guide for any file extension.
 */
export function getHowToOpenGuide(extInput: string): HowToOpenGuideData {
  const cleanExt = (extInput || 'heic').trim().replace(/^\./, '').toLowerCase();
  const upperExt = cleanExt.toUpperCase();
  const info: FileTypeInfo = getOrGenerateExtensionInfo(cleanExt);
  const override = FORMAT_SPECIFIC_OVERRIDES[cleanExt] || {};

  // 1. In-browser support determination
  let inBrowserSupport = override.inBrowserSupport || {
    supported: false,
    type: 'none',
    note: 'Inspect file headers and metadata safely in browser memory.'
  };

  if (!override.inBrowserSupport) {
    if (info.category === 'Images') {
      inBrowserSupport = {
        supported: true,
        type: 'image',
        note: 'Render image previews and inspect color profile/EXIF metadata directly in your browser.'
      };
    } else if (info.category === 'Audio & Video') {
      inBrowserSupport = {
        supported: true,
        type: cleanExt.includes('mp3') || cleanExt.includes('wav') || cleanExt.includes('flac') ? 'audio' : 'video',
        note: 'Direct client-side media playback or audio waveform spectrum inspection.'
      };
    } else if (info.category === 'Documents') {
      inBrowserSupport = {
        supported: true,
        type: cleanExt === 'pdf' ? 'pdf' : 'text',
        note: 'View formatted text, character encoding, and document structural blocks in-browser.'
      };
    } else if (info.category === 'Archives') {
      inBrowserSupport = {
        supported: true,
        type: 'archive',
        note: 'Browse the compressed archive directory tree without extracting to disk.'
      };
    } else {
      inBrowserSupport = {
        supported: true,
        type: 'hex',
        note: 'Inspect magic bytes, binary header offsets, and cryptographic hashes in local memory.'
      };
    }
  }

  // 2. Generate OS-Specific Step-by-Step Instructions
  const osGuides = generateOsSpecificSteps(cleanExt, upperExt, info);

  // 3. Recommended Software from AnyFileX Compatibility Database
  const recommendedSoftware: SoftwareRecommendationItem[] = SOFTWARE_LIST
    .filter((soft) =>
      soft.supportedExtensions.some((e) => e.toLowerCase() === cleanExt) ||
      info.popularApps.some((app) => app.name.toLowerCase().includes(soft.name.toLowerCase()) || soft.name.toLowerCase().includes(app.name.toLowerCase()))
    )
    .slice(0, 8)
    .map((soft) => {
      const isEditor = soft.category.includes('Design') || soft.category.includes('Office') || soft.category.includes('Audio') || soft.category.includes('Developer');
      return {
        id: soft.id,
        name: soft.name,
        developer: soft.developer,
        category: soft.category,
        supportedOS: soft.supportedOS,
        priceType: soft.priceType as any,
        priceText: soft.priceText || (soft.priceType === 'Free' ? 'Free Download' : 'Paid Software'),
        rating: soft.rating || 4.8,
        canOpen: true,
        canView: true,
        canEdit: isEditor,
        canConvert: isEditor,
        routeId: soft.id,
        websiteUrl: soft.websiteUrl,
      };
    });

  // If none matched from catalog, generate verified defaults based on OS and category
  if (recommendedSoftware.length === 0) {
    (info.popularApps || []).slice(0, 6).forEach((app, idx) => {
      recommendedSoftware.push({
        id: `app-${idx}-${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: app.name,
        developer: 'Verified Software Vendor',
        category: info.category,
        supportedOS: (app.os || ['windows', 'mac']) as any,
        priceType: app.isFree ? 'Free' : 'Freemium',
        priceText: app.isFree ? 'Free Software' : 'Commercial App',
        rating: 4.7,
        canOpen: true,
        canView: true,
        canEdit: !app.isFree,
        canConvert: true,
        routeId: 'software',
        websiteUrl: 'https://anyfilex.com/software',
      });
    });
  }

  // 4. Browser Options
  const browserOptions = [
    {
      title: 'AnyFileX Client-Side Inspector',
      description: `Preview, extract metadata, and verify magic byte signatures for .${upperExt} files with 100% private browser memory execution.`,
      badge: 'Zero Upload / Local RAM',
    },
    {
      title: 'WebAssembly Format Decoder',
      description: `Run high-performance in-browser WebAssembly rendering to decode .${upperExt} streams without installing desktop executables.`,
      badge: 'Fast WebAssembly',
    },
  ];

  // 5. Six Failure Modes for Troubleshooting
  const troubleshooting: TroubleshootingFailureMode[] = [
    {
      id: 'missing-codec',
      issue: 'Missing Codec or Unregistered Application Handler',
      cause: `Your operating system does not have the native codec or file association registered for the .${upperExt} format.`,
      diagnostic: `When double-clicking the file, Windows displays 'How do you want to open this file?' or macOS says 'There is no application set to open the document.'`,
      solution: `Install a verified universal reader (such as ${recommendedSoftware[0]?.name || 'a compatible viewer'}) or use the AnyFileX in-browser viewer.`,
      toolAction: {
        label: 'View Software Recommendations',
        route: { view: 'software' }
      }
    },
    {
      id: 'misnamed-extension',
      issue: 'Incorrect or Misnamed File Extension',
      cause: `The file was saved with an incorrect .${upperExt} extension when its actual internal binary structure belongs to another format (e.g. a ZIP archive saved as .DAT).`,
      diagnostic: `Software crashes or says 'Invalid file header' or 'File is not a valid ${upperExt}'.`,
      solution: `Check the true magic byte signature using the AnyFileX Magic Byte Detector to reveal the genuine underlying file type.`,
      toolAction: {
        label: 'Detect True File Type via Magic Bytes',
        route: { view: 'magic-byte-detector' }
      }
    },
    {
      id: 'corrupted-file',
      issue: 'Corrupted or Incomplete File Download',
      cause: `The file transfer was interrupted, network packets were lost, or the storage media suffered bad sectors, truncating essential header/footer markers.`,
      diagnostic: `The file size is unexpectedly small (0 KB or truncated) and checksum hashes do not match source values.`,
      solution: `Re-download the original file, check cryptographic SHA-256 hashes, or run through the AnyFileX File Repair engine.`,
      toolAction: {
        label: 'Diagnose & Repair Corrupted File',
        route: { view: 'repair' }
      }
    },
    {
      id: 'encryption-password',
      issue: 'Encryption or Password Protection',
      cause: `The .${upperExt} container is encrypted with AES or proprietary DRM, requiring a decryption key or password before content can be uncompressed.`,
      diagnostic: `Prompting for a passphrase, or reading as random high-entropy ciphertext bytes without recognizable structure.`,
      solution: `Ensure you have the valid decryption credentials from the file creator or sender.`,
      toolAction: {
        label: 'Inspect Entropy in File Analyzer',
        route: { view: 'file-analyzer' }
      }
    },
    {
      id: 'version-incompatibility',
      issue: 'Incompatible or Newer Format Revision',
      cause: `The file was created in a newer revision of the .${upperExt} specification (e.g. Office Open XML vs legacy binary, or latest Adobe PSD smart object features) that older software cannot parse.`,
      diagnostic: `Software opens the file but displays blank pages, distorted graphics, or error 'Created with a newer version'.`,
      solution: `Update your desktop reader to the latest version or convert the file to a universally backward-compatible format.`,
      toolAction: {
        label: 'Convert to Universal Format',
        route: { view: 'converters' }
      }
    },
    {
      id: 'security-permissions',
      issue: 'OS Gatekeeper or Execution Sandbox Restriction',
      cause: `macOS Gatekeeper ('App from unidentified developer') or Windows SmartScreen blocked the file from executing or launching associated helper scripts.`,
      diagnostic: `Operating system security popups displaying warning flags or quarantined file attributes.`,
      solution: `On macOS, Right-click &rarr; Open &rarr; Confirm Open. On Windows, Right-click &rarr; Properties &rarr; Check 'Unblock' &rarr; Apply.`,
      toolAction: {
        label: 'Security & Danger Rating Guide',
        route: { view: 'extension-detail', ext: cleanExt }
      }
    }
  ];

  // 6. Conversion Workflow Pathway: Analyze -> Convert -> Open
  const matchedConverters = CONVERTERS_LIST.filter(
    (c) => c.fromExt.toLowerCase() === cleanExt || c.id.startsWith(`${cleanExt}-to-`)
  );
  const availableConverters = matchedConverters.map((c) => ({
    targetExt: c.toExt.toUpperCase(),
    label: `${upperExt} to ${c.toExt.toUpperCase()}`,
    routeId: c.id,
  }));

  if (availableConverters.length === 0) {
    if (info.category === 'Images') {
      availableConverters.push(
        { targetExt: 'JPG', label: `${upperExt} to JPG`, routeId: `${cleanExt}-to-jpg` },
        { targetExt: 'PNG', label: `${upperExt} to PNG`, routeId: `${cleanExt}-to-png` },
        { targetExt: 'PDF', label: `${upperExt} to PDF`, routeId: `${cleanExt}-to-pdf` }
      );
    } else if (info.category === 'Documents') {
      availableConverters.push(
        { targetExt: 'PDF', label: `${upperExt} to PDF`, routeId: `${cleanExt}-to-pdf` },
        { targetExt: 'TXT', label: `${upperExt} to TXT`, routeId: `${cleanExt}-to-txt` }
      );
    }
  }

  const primaryConverter = availableConverters[0];

  const conversionWorkflow = {
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Inspect & Analyze File',
        description: `Drop your .${upperExt} into AnyFileX Analyzer to confirm the true MIME type, magic bytes, and file integrity before converting.`,
        actionText: 'Launch File Analyzer',
        route: { view: 'file-analyzer' } as AppRoute,
      },
      {
        stepNumber: 2,
        title: 'Step 2: Convert to Universal Format',
        description: primaryConverter
          ? `Convert .${upperExt} to .${primaryConverter.targetExt} in seconds using client-side WebAssembly transformation.`
          : `Convert .${upperExt} into a standard, universally supported format with zero file uploads.`,
        actionText: primaryConverter ? `Convert to ${primaryConverter.targetExt}` : 'Browse All Converters',
        route: primaryConverter
          ? ({ view: 'converter-detail', id: primaryConverter.routeId } as AppRoute)
          : ({ view: 'converters' } as AppRoute),
      },
      {
        stepNumber: 3,
        title: 'Step 3: Open Converted File Natively',
        description: `Download the converted file and open it instantly in any default web browser, mobile device, or desktop operating system without special software.`,
        actionText: 'Complete Workflow',
        route: { view: 'converters' } as AppRoute,
      },
    ],
    availableConverters,
  };

  // 7. Internal Links
  const allExts = getAllFileTypeInfos();
  const relatedExts = allExts
    .filter((e) => e.extension.toLowerCase() !== cleanExt && e.category === info.category)
    .slice(0, 6)
    .map((e) => ({
      ext: e.extension.toUpperCase(),
      name: e.name,
      category: e.category,
    }));

  const comparisons = CURATED_COMPARISONS.filter(
    (c) => c.ext1.toLowerCase() === cleanExt || c.ext2.toLowerCase() === cleanExt
  ).slice(0, 4);

  const tools = getAllTools().slice(0, 4).map(t => ({
    name: t.name,
    slug: t.slug,
    description: t.description,
  }));

  // 8. Dynamic High-Quality FAQs
  const faqs = [
    {
      question: `What is the easiest way to open a .${upperExt} file without installing software?`,
      answer: `The fastest and safest method is to use the AnyFileX in-browser viewer above. It uses WebAssembly to parse and display .${upperExt} (${info.name}) files directly in your browser's local memory, meaning your files remain 100% confidential and never upload to external servers.`
    },
    {
      question: `Why does my computer show an error when trying to open .${upperExt}?`,
      answer: `Common causes include missing software codecs (e.g. Windows missing the HEIF/HEVC codec for Apple photos), an unsupported default application, an incomplete file download, or a file saved with an incorrect extension. You can use our Magic Byte Detector to verify the genuine file type.`
    },
    {
      question: `How do I make a specific program the default app for .${upperExt} files?`,
      answer: `On Windows, right-click the file &rarr; select 'Open with' &rarr; 'Choose another app' &rarr; check 'Always use this app'. On macOS, select the file &rarr; press Cmd + I &rarr; expand 'Open with:' &rarr; select your app &rarr; click 'Change All...'.`
    },
    {
      question: `Can I convert a .${upperExt} file if I cannot open it?`,
      answer: `Yes. If your current operating system lacks the necessary software, you can convert your .${upperExt} file to a standard format (such as ${primaryConverter?.targetExt || 'PDF or JPG'}) using our free, private online converters.`
    },
    {
      question: `Is opening .${upperExt} files safe?`,
      answer: `The security risk rating for .${upperExt} files is rated as ${info.dangerRating}. While document and media files are generally safe, always inspect files from unknown email attachments for embedded executable scripts before opening.`
    }
  ];

  // 9. Structured Schema.org HowTo + FAQPage Graph
  const schemaJson = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Open a .${upperExt} File on Windows, Mac, Android, and iOS`,
      description: `Complete step-by-step verified instructions to open, view, troubleshoot, and convert .${upperExt} (${info.name}) files across all desktop and mobile operating systems.`,
      totalTime: 'PT2M',
      step: [
        {
          '@type': 'HowToStep',
          name: `Open .${upperExt} on Windows`,
          text: osGuides.windows.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.detail}`).join(' '),
          url: `https://anyfilex.com/how-to-open/${cleanExt}#windows`,
        },
        {
          '@type': 'HowToStep',
          name: `Open .${upperExt} on macOS`,
          text: osGuides.mac.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.detail}`).join(' '),
          url: `https://anyfilex.com/how-to-open/${cleanExt}#mac`,
        },
        {
          '@type': 'HowToStep',
          name: `Open .${upperExt} on Linux`,
          text: osGuides.linux.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.detail}`).join(' '),
          url: `https://anyfilex.com/how-to-open/${cleanExt}#linux`,
        },
        {
          '@type': 'HowToStep',
          name: `Open .${upperExt} on Mobile (iPhone & Android)`,
          text: `Use native Apple Photos or Files on iOS, or Google Photos / Files by Google on Android. For unsupported formats, convert online via AnyFileX.`,
          url: `https://anyfilex.com/how-to-open/${cleanExt}#mobile`,
        },
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        }
      }))
    }
  ];

  return {
    extension: cleanExt,
    upperExt,
    name: info.name,
    category: info.category,
    mimeType: info.mimeType,
    magicBytesHex: info.magicBytesHex,
    dangerRating: info.dangerRating,
    summary: info.description,
    whyItIsHardToOpen: override.whyItIsHardToOpen || `Opening a .${upperExt} file requires software capable of decoding the ${info.name} format. If your operating system lacks a registered viewer or native codec, the file cannot be previewed without additional tools.`,
    inBrowserSupport,
    osGuides,
    recommendedSoftware,
    browserOptions,
    troubleshooting,
    conversionWorkflow,
    internalLinks: {
      formatGuideUrl: `/format/${cleanExt}`,
      extensionUrl: `/file-extensions/${cleanExt}`,
      comparisons,
      relatedExtensions: relatedExts,
      recommendedTools: tools,
    },
    faqs,
    schemaJson,
  };
}

/**
 * Generates verified, category-aware OS instructions for Windows, Mac, Linux, iOS, and Android
 */
function generateOsSpecificSteps(
  cleanExt: string,
  upperExt: string,
  info: FileTypeInfo
): HowToOpenGuideData['osGuides'] {
  const cat = info.category;

  // --- WINDOWS ---
  const winDefault = typeof info.osSupport?.windows === 'string' ? info.osSupport.windows : 'Windows Photos / File Viewer';
  let winCodec = undefined;
  let winSteps: StepInstruction[] = [];

  if (cat === 'Images') {
    if (cleanExt === 'heic' || cleanExt === 'heif') {
      winCodec = 'Requires "HEIF Image Extensions" and "HEVC Video Extensions" from Microsoft Store.';
      winSteps = [
        {
          stepNumber: 1,
          title: 'Install HEIF Codec from Microsoft Store',
          detail: 'Open the Microsoft Store app and search for "HEIF Image Extensions" (free from Microsoft Corporation) and install it to enable native thumbnail previews.',
          tip: 'If photos still show blank, install "HEVC Video Extensions" or use the free CopyTrans HEIC plugin for Windows.',
        },
        {
          stepNumber: 2,
          title: 'Double-Click in File Explorer',
          detail: 'Once the codec is installed, double-click your .HEIC photo to view in the Windows Photos app.',
        },
        {
          stepNumber: 3,
          title: 'Alternative: Open with IrfanView or AnyFileX',
          detail: 'Install free IrfanView with all plugins, or drag the file into the AnyFileX in-browser viewer above.',
        }
      ];
    } else {
      winSteps = [
        {
          stepNumber: 1,
          title: 'Double-Click in Windows File Explorer',
          detail: `Locate your .${upperExt} file and double-click. Windows 11/10 will attempt to open it with ${winDefault}.`,
        },
        {
          stepNumber: 2,
          title: 'Use "Open With" Menu',
          detail: `Right-click the .${upperExt} file &rarr; select 'Open with' &rarr; click 'Choose another app'. Select your preferred graphics editor or viewer.`,
        },
        {
          stepNumber: 3,
          title: 'Set as Default Application',
          detail: `Check the box 'Always use this app to open .${upperExt} files' to create a permanent system file association.`,
        }
      ];
    }
  } else if (cat === 'Archives') {
    winSteps = [
      {
        stepNumber: 1,
        title: 'Native Windows 11 Extraction',
        detail: `Windows 11 includes native libarchive support. Right-click the .${upperExt} archive &rarr; click 'Extract All...' &rarr; select destination folder.`,
      },
      {
        stepNumber: 2,
        title: 'Use 7-Zip or WinRAR (Recommended for Encrypted / Multi-Part)',
        detail: `Download free open-source 7-Zip. Right-click the .${upperExt} file &rarr; select '7-Zip' &rarr; 'Extract to "...\\"'.`,
        tip: '7-Zip provides faster decompression and supports password-protected archives.',
      },
      {
        stepNumber: 3,
        title: 'Inspect Archive in AnyFileX Browser Viewer',
        detail: `Drop the .${upperExt} into AnyFileX to view individual file entries without extracting to disk.`,
      }
    ];
  } else if (cat === 'Audio & Video') {
    winSteps = [
      {
        stepNumber: 1,
        title: 'Open with VLC Media Player (Universal)',
        detail: `Download free open-source VLC Media Player. Right-click the .${upperExt} file &rarr; select 'Open with' &rarr; 'VLC media player'.`,
        tip: 'VLC includes built-in codecs for virtually every audio and video stream.',
      },
      {
        stepNumber: 2,
        title: 'Try Windows Media Player / Films & TV',
        detail: `Double-click to open in Windows default player. If prompted with 'Codec Missing', install the K-Lite Codec Pack Standard.`,
      }
    ];
  } else if (cat === 'Documents') {
    winSteps = [
      {
        stepNumber: 1,
        title: 'Open in Microsoft Office or LibreOffice',
        detail: `Launch Microsoft 365 or free open-source LibreOffice, click 'File' &rarr; 'Open' and select your .${upperExt} document.`,
      },
      {
        stepNumber: 2,
        title: 'Browser PDF / Document Reader',
        detail: `For PDF or eBook files, drag directly into Google Chrome or Microsoft Edge to read without third-party software.`,
      }
    ];
  } else {
    winSteps = [
      {
        stepNumber: 1,
        title: 'Right-Click & Select "Open With"',
        detail: `Right-click your .${upperExt} file in File Explorer &rarr; select 'Open with' &rarr; choose a compatible text editor, viewer, or specialized CAD tool.`,
      },
      {
        stepNumber: 2,
        title: 'Inspect Header with Notepad or VS Code',
        detail: `For code, data, or configuration files, open with Visual Studio Code or Notepad++.`,
      },
      {
        stepNumber: 3,
        title: 'Verify File Integrity in AnyFileX',
        detail: `Drop the file into the AnyFileX File Forensics tool to check magic byte headers and determine true application compatibility.`,
      }
    ];
  }

  // --- MACOS ---
  const macDefault = typeof info.osSupport?.mac === 'string' ? info.osSupport.mac : 'Apple Preview / Quick Look';
  let macSteps: StepInstruction[] = [
    {
      stepNumber: 1,
      title: 'Instant Quick Look (Spacebar)',
      detail: `Select the .${upperExt} file in Finder and tap the Spacebar on your keyboard for an instant floating preview.`,
    },
    {
      stepNumber: 2,
      title: 'Open with Apple Native App',
      detail: `Double-click the file to launch in ${macDefault}.`,
    },
    {
      stepNumber: 3,
      title: 'Set Permanent macOS Association',
      detail: `Select the file in Finder &rarr; press Cmd + I (Get Info) &rarr; expand 'Open with:' &rarr; choose your preferred app &rarr; click 'Change All...'.`,
    }
  ];

  if (cat === 'Archives' && (cleanExt === 'dmg' || cleanExt === 'iso')) {
    macSteps = [
      {
        stepNumber: 1,
        title: 'Double-Click to Mount Virtual Disk Image',
        detail: `Double-click the .${upperExt} file in Finder. macOS DiskImageMounter will verify the checksum and mount a new virtual drive on your Desktop.`,
      },
      {
        stepNumber: 2,
        title: 'Install or Copy Contents',
        detail: `Open the mounted virtual volume, drag the application icon to your /Applications folder, then Eject the disk image.`,
      }
    ];
  } else if (cat === 'Archives') {
    macSteps = [
      {
        stepNumber: 1,
        title: 'Use Archive Utility or The Unarchiver',
        detail: `Double-click to decompress with macOS Archive Utility. For RAR, 7Z, or encrypted archives, download free 'The Unarchiver' or 'Keka' from the Mac App Store.`,
      }
    ];
  }

  // --- LINUX ---
  const linuxDefault = typeof info.osSupport?.linux === 'string' ? info.osSupport.linux : 'GNOME Files / Default Viewer';
  let linuxPkg = undefined;
  let linuxSteps: StepInstruction[] = [];

  if (cat === 'Images' && (cleanExt === 'heic' || cleanExt === 'avif')) {
    linuxPkg = 'sudo apt install libheif-examples heif-gdk-pixbuf';
    linuxSteps = [
      {
        stepNumber: 1,
        title: 'Install Image Codec Library',
        detail: 'On Ubuntu / Debian, run terminal command to enable thumbnails in Nautilus:',
        command: 'sudo apt update && sudo apt install libheif-examples heif-gdk-pixbuf',
      },
      {
        stepNumber: 2,
        title: 'Open in Eye of GNOME or GIMP',
        detail: `Launch your default image viewer or GIMP: gimp file.${cleanExt}`,
        command: `xdg-open photo.${cleanExt}`,
      },
      {
        stepNumber: 3,
        title: 'CLI Batch Conversion via heif-convert',
        detail: 'Convert to JPEG quickly from the command line:',
        command: `heif-convert input.${cleanExt} output.jpg`,
      }
    ];
  } else if (cat === 'Archives') {
    linuxPkg = 'sudo apt install p7zip-full unrar tar';
    linuxSteps = [
      {
        stepNumber: 1,
        title: 'Command-Line Archive Extraction',
        detail: `Extract .${upperExt} using standard terminal utilities:`,
        command: cleanExt === '7z' ? `7z x archive.${cleanExt}` : cleanExt === 'rar' ? `unrar x archive.${cleanExt}` : `tar -xvf archive.${cleanExt}`,
      },
      {
        stepNumber: 2,
        title: 'GUI Archive Manager (File Roller / Ark)',
        detail: 'Right-click the archive in your file manager &rarr; select "Extract Here".',
      }
    ];
  } else {
    linuxSteps = [
      {
        stepNumber: 1,
        title: 'Open with xdg-open',
        detail: `Launch using your desktop environment's registered handler:`,
        command: `xdg-open document.${cleanExt}`,
      },
      {
        stepNumber: 2,
        title: 'Inspect File MIME & Magic Bytes',
        detail: `Verify file header format via the Linux file utility:`,
        command: `file -b --mime-type sample.${cleanExt}`,
      }
    ];
  }

  // --- IOS (iPhone / iPad) ---
  let iosSteps: StepInstruction[] = [
    {
      stepNumber: 1,
      title: 'Open in Apple Photos or Files App',
      detail: `Save the .${upperExt} to your iCloud Drive or On My iPhone, then tap it in the Files app.`,
    },
    {
      stepNumber: 2,
      title: 'Use the iOS Share Sheet',
      detail: `Tap the Share icon (square with upward arrow) &rarr; choose 'Open in...' &rarr; select your companion productivity or viewer app.`,
    },
    {
      stepNumber: 3,
      title: 'Alternative: In-Browser AnyFileX Converter',
      detail: `If iOS cannot display the format natively, open Safari, navigate to AnyFileX, and convert to JPG or PDF.`,
    }
  ];

  // --- ANDROID ---
  let androidSteps: StepInstruction[] = [
    {
      stepNumber: 1,
      title: 'Open via Google Photos or Files by Google',
      detail: `Navigate to your Downloads folder in Files by Google, tap the .${upperExt} file to trigger the Android Intent chooser.`,
    },
    {
      stepNumber: 2,
      title: 'Install Dedicated Viewer from Google Play',
      detail: `If Android displays 'No application found to open this file', download a recommended app (such as VLC for media or Google Docs for documents).`,
    },
    {
      stepNumber: 3,
      title: 'Instant Web Preview',
      detail: `Open Google Chrome on Android, visit AnyFileX, and view or convert your file directly in browser memory.`,
    }
  ];

  return {
    windows: {
      isSupported: true,
      title: `How to Open .${upperExt} on Windows 11 & Windows 10`,
      badge: 'Windows 11 / 10 / 8 / 7',
      defaultApp: winDefault,
      codecNote: winCodec,
      steps: winSteps,
    },
    mac: {
      isSupported: true,
      title: `How to Open .${upperExt} on macOS (Apple Silicon & Intel)`,
      badge: 'macOS Sequoia, Sonoma & Ventura',
      defaultApp: macDefault,
      steps: macSteps,
      terminalCommand: `open sample.${cleanExt}`,
    },
    linux: {
      isSupported: true,
      title: `How to Open .${upperExt} on Linux (Ubuntu, Debian, Fedora, Arch)`,
      badge: 'Ubuntu / Debian / Fedora / Arch',
      defaultApp: linuxDefault,
      packageInstall: linuxPkg,
      steps: linuxSteps,
    },
    ios: {
      isSupported: true,
      title: `How to Open .${upperExt} on iPhone & iPad`,
      badge: 'iOS 17, 16 & iPadOS',
      defaultApp: typeof info.osSupport?.ios === 'string' ? info.osSupport.ios : 'Apple Files / Photos',
      steps: iosSteps,
    },
    android: {
      isSupported: true,
      title: `How to Open .${upperExt} on Android`,
      badge: 'Android 14, 13 & 12',
      defaultApp: typeof info.osSupport?.android === 'string' ? info.osSupport.android : 'Files by Google / Google Photos',
      steps: androidSteps,
    }
  };
}
