import { getAllFileTypeInfos } from '../database/extensionEngine';
import { SOFTWARE_LIST } from '../../data/softwareData';
import { CONVERTERS_LIST } from '../../data/convertersData';
import { REPAIR_GUIDES } from '../../data/repairData';
import { TROUBLESHOOTING_GUIDES } from '../database/troubleshootingData';
import { TECHNICAL_AUTHORITY_GUIDES } from '../database/technicalAuthorityData';
import { GUIDES_LIST, BLOG_POSTS } from '../../data/guidesData';
import { CATEGORIES_LIST } from '../../data/categoriesData';
import { getAllContentEntities } from '../content/contentRegistry';
import { getPrioritizedFormatList, getOrGenerateFormatGuide } from '../guides/formatGuideEngine';
import { AppRoute, FileTypeInfo } from '../../types';

export type SearchContentType =
  | 'extension'
  | 'software'
  | 'converter'
  | 'repair'
  | 'guide'
  | 'blog'
  | 'category'
  | 'tool'
  | 'comparison'
  | 'mime_type'
  | 'security';

export interface QuickAction {
  label: string;
  action: 'open' | 'convert' | 'repair' | 'inspect' | 'navigate';
  route: AppRoute;
}

export interface SearchRecord {
  id: string;
  slug: string;
  url: string;
  route: AppRoute;
  title: string;
  description: string;
  type: SearchContentType;
  category: string;
  keywords: string[];
  aliases: string[];
  extension?: string;
  mime_type?: string;
  software?: string[];
  popularity: number;
  featured?: boolean;
  searchWeight: number;
  lastUpdated: string;
  quickActions: QuickAction[];
}

export interface SearchOptions {
  type?: 'all' | SearchContentType | 'extensions' | 'tools' | 'converters' | 'software' | 'repair' | 'guides';
  category?: string;
  limit?: number;
  fuzzy?: boolean;
}

export interface GroupedSearchResults {
  extensions: SearchRecord[];
  software: SearchRecord[];
  converters: SearchRecord[];
  tools: SearchRecord[];
  repair: SearchRecord[];
  guides: SearchRecord[];
  categories: SearchRecord[];
  comparisons: SearchRecord[];
  allSorted: SearchRecord[];
  totalCount: number;
}

class SearchEngine {
  private indexMap: Map<string, SearchRecord> = new Map();
  private recordsCache: SearchRecord[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initializeIndex();
  }

  /**
   * Builds or re-builds the entire search index dynamically from all data sources.
   */
  public initializeIndex(): void {
    this.indexMap.clear();

    // 1. Index All File Extensions from Database/Engine
    const exts = getAllFileTypeInfos();
    exts.forEach((e) => this.registerExtensionRecord(e));

    // 2. Index All Software
    SOFTWARE_LIST.forEach((s) => {
      const rec: SearchRecord = {
        id: `sw-${s.id}`,
        slug: `software/${s.id}`,
        url: `https://www.anyfilex.com/software/${s.id}`,
        route: { view: 'software-detail', id: s.id },
        title: `${s.name} (${s.developer})`,
        description: s.description,
        type: 'software',
        category: s.category,
        keywords: [
          s.name,
          s.developer,
          ...s.supportedExtensions,
          ...s.supportedExtensions.map((ext) => `.${ext}`),
          ...s.features
        ],
        aliases: [s.name, s.developer, `open ${s.supportedExtensions.join(' ')}`, `best software for ${s.category}`],
        software: [s.name],
        popularity: Math.round(s.rating * 20),
        featured: s.rating >= 4.7,
        searchWeight: 85,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'View Software Overview', action: 'open', route: { view: 'software-detail', id: s.id } },
          { label: 'Supported Formats', action: 'navigate', route: { view: 'software-detail', id: s.id } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 3. Index All Converters
    CONVERTERS_LIST.forEach((c) => {
      const rec: SearchRecord = {
        id: `conv-${c.id}`,
        slug: `converters/${c.id}`,
        url: `https://www.anyfilex.com/converters/${c.id}`,
        route: { view: 'converter-detail', id: c.id },
        title: c.name,
        description: c.description,
        type: 'converter',
        category: c.category,
        keywords: [
          c.fromExt,
          c.toExt,
          `${c.fromExt} to ${c.toExt}`,
          `convert ${c.fromExt}`,
          `${c.fromExt} converter`,
          ...c.recommendedApps
        ],
        aliases: [
          `${c.fromExt} to ${c.toExt}`,
          `convert .${c.fromExt} to .${c.toExt}`,
          `free online ${c.fromExt} converter`,
          `how to convert ${c.fromExt}`
        ],
        extension: c.fromExt,
        popularity: 90,
        featured: true,
        searchWeight: 90,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: `Convert ${c.fromExt} to ${c.toExt}`, action: 'convert', route: { view: 'converter-detail', id: c.id } },
          { label: `Inspect .${c.fromExt} Header`, action: 'inspect', route: { view: 'extension-detail', ext: c.fromExt.toLowerCase() } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 4. Index All Repair & Troubleshooting Guides
    REPAIR_GUIDES.forEach((r) => {
      const rec: SearchRecord = {
        id: `repair-${r.id}`,
        slug: `troubleshoot/${r.id}`,
        url: `https://www.anyfilex.com/troubleshoot/${r.id}`,
        route: { view: 'repair-detail', id: r.id },
        title: r.title,
        description: r.symptoms.join(' • '),
        type: 'repair',
        category: r.category,
        keywords: [
          r.extension,
          `repair ${r.extension}`,
          `corrupt ${r.extension}`,
          `fix ${r.extension}`,
          ...r.symptoms,
          ...r.causes
        ],
        aliases: [
          `repair .${r.extension}`,
          `fix corrupted ${r.extension}`,
          `unreadable ${r.extension} fix`,
          `crc error ${r.extension}`
        ],
        extension: r.extension,
        popularity: 85,
        featured: true,
        searchWeight: 88,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: `Repair Corrupted .${r.extension}`, action: 'repair', route: { view: 'repair-detail', id: r.id } },
          { label: 'Inspect Magic Bytes', action: 'inspect', route: { view: 'magic-byte-detector' } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    TROUBLESHOOTING_GUIDES.forEach((tg) => {
      const rec: SearchRecord = {
        id: `troubleshoot-${tg.id}`,
        slug: `troubleshoot/${tg.id}`,
        url: `https://www.anyfilex.com/troubleshoot/${tg.id}`,
        route: { view: 'repair-detail', id: tg.id },
        title: tg.title,
        description: tg.problemSummary,
        type: 'repair',
        category: tg.category,
        keywords: [
          tg.title,
          tg.subtitle,
          ...tg.commonErrorMessages,
          ...tg.symptoms,
          ...tg.relatedExtensions,
          'troubleshoot',
          'diagnosis',
          'why wont file open',
          'corrupted',
          'wrong extension'
        ],
        aliases: [
          tg.title,
          ...tg.commonErrorMessages
        ],
        extension: tg.relatedExtensions[0],
        popularity: 95,
        featured: true,
        searchWeight: 95,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'Run Diagnostic Check', action: 'inspect', route: { view: 'repair-detail', id: tg.id } },
          { label: 'Troubleshooting Guide', action: 'open', route: { view: 'repair-detail', id: tg.id } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 4b. Index File Security & Technical Authority Guides (Phase 11)
    TECHNICAL_AUTHORITY_GUIDES.forEach((tag) => {
      const rec: SearchRecord = {
        id: `tech-auth-${tag.id}`,
        slug: `security/${tag.slug}`,
        url: `https://www.anyfilex.com/security/${tag.slug}`,
        route: { view: 'technical-guide', slug: tag.slug } as any,
        title: tag.title,
        description: tag.executiveSummary,
        type: 'security',
        category: tag.category,
        keywords: [
          tag.title,
          tag.shortTitle,
          tag.subtitle,
          tag.category,
          ...(tag.relatedExtensions || []),
          ...(tag.keyTermsGlossary ? tag.keyTermsGlossary.map((k) => k.term) : []),
          ...(tag.standardsAndRFCs ? tag.standardsAndRFCs.map((s) => s.standard) : []),
          'technical authority',
          'file security',
          'binary signature',
          'magic bytes'
        ],
        aliases: [
          tag.title,
          tag.shortTitle,
          `what is ${tag.shortTitle}`,
          `explain ${tag.shortTitle}`
        ],
        extension: tag.relatedExtensions[0],
        popularity: 96,
        featured: true,
        searchWeight: 96,
        lastUpdated: tag.lastUpdated,
        quickActions: [
          { label: 'Read Technical Authority Guide', action: 'open', route: { view: 'technical-guide', slug: tag.slug } as any },
          { label: 'File Security Hub', action: 'navigate', route: { view: 'security-hub' } as any }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // Register Security Hub
    this.indexMap.set('hub-file-security', {
      id: 'hub-file-security',
      slug: 'security',
      url: 'https://www.anyfilex.com/security',
      route: { view: 'security-hub' } as any,
      title: 'File Security & Technical Authority Center',
      description: 'Comprehensive engineering references on binary signatures, magic bytes, MIME types, Shannon entropy, and cryptographic integrity.',
      type: 'security',
      category: 'File Security',
      keywords: ['file security', 'technical authority', 'magic bytes', 'entropy', 'sha256', 'zip bomb', 'mime type', 'file signatures'],
      aliases: ['security center', 'file authority hub', 'technical hub'],
      popularity: 98,
      featured: true,
      searchWeight: 98,
      lastUpdated: new Date().toISOString(),
      quickActions: [
        { label: 'Open Security & Tech Hub', action: 'navigate', route: { view: 'security-hub' } as any }
      ]
    });

    // 5. Index Guides & Blog Articles
    GUIDES_LIST.forEach((g) => {
      const ext = g.relatedExtensions && g.relatedExtensions.length > 0 ? g.relatedExtensions[0] : '';
      const rec: SearchRecord = {
        id: `guide-${g.id}`,
        slug: `guides/${g.id}`,
        url: `https://www.anyfilex.com/guides/${g.id}`,
        route: { view: 'guide-detail', id: g.id },
        title: g.title,
        description: g.summary,
        type: 'guide',
        category: g.category,
        keywords: [g.title, g.category, ...(g.relatedExtensions || [])],
        aliases: [g.title, `how to open ${ext}`, `file guide ${g.category}`],
        extension: ext,
        popularity: 80,
        searchWeight: 75,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'Read Complete Guide', action: 'open', route: { view: 'guide-detail', id: g.id } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    BLOG_POSTS.forEach((b) => {
      const rec: SearchRecord = {
        id: `blog-${b.id}`,
        slug: `blog/${b.id}`,
        url: `https://www.anyfilex.com/blog/${b.id}`,
        route: { view: 'blog-detail', id: b.id },
        title: b.title,
        description: b.summary,
        type: 'blog',
        category: b.category,
        keywords: [b.title, b.category, ...(b.tags || [])],
        aliases: [b.title, `file tutorial ${b.category}`],
        popularity: 75,
        searchWeight: 70,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'Read Blog Post', action: 'open', route: { view: 'blog-detail', id: b.id } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 5b. Index Content Authority Entities & Topic Hubs
    const contentEntities = getAllContentEntities();
    contentEntities.forEach((ce) => {
      const rec: SearchRecord = {
        id: `content-${ce.id}`,
        slug: `guides/${ce.slug}`,
        url: `https://www.anyfilex.com/guides/${ce.slug}`,
        route: { view: 'guide-detail', id: ce.slug },
        title: ce.title,
        description: ce.summary,
        type: 'guide',
        category: ce.primaryTopic,
        keywords: [ce.title, ce.primaryTopic, ...(ce.relatedExtensions || []), ...(ce.seoMeta?.keywords || [])],
        aliases: [ce.h1 || '', ce.title, `how to open ${ce.relatedExtensions[0] || ''}`],
        extension: ce.relatedExtensions[0] || '',
        popularity: 88,
        searchWeight: 85,
        lastUpdated: ce.updatedDate,
        quickActions: [
          { label: 'Read Authority Guide', action: 'open', route: { view: 'guide-detail', id: ce.slug } }
        ]
      };
      this.indexMap.set(rec.id, rec);

      // Register Topic Hub entry if extension present
      if (ce.relatedExtensions && ce.relatedExtensions[0]) {
        const ext = ce.relatedExtensions[0].toLowerCase();
        const hubId = `hub-${ext}`;
        if (!this.indexMap.has(hubId)) {
          this.indexMap.set(hubId, {
            id: hubId,
            slug: `file-extensions/${ext}`,
            url: `https://www.anyfilex.com/file-extensions/${ext}`,
            route: { view: 'content-hub' as any, topic: ext },
            title: `${ext.toUpperCase()} Topic Authority Hub`,
            description: `Complete technical hub for ${ext.toUpperCase()} files: tools, conversion guides, magic bytes, and OS instructions.`,
            type: 'guide',
            category: 'Topic Hubs',
            keywords: [ext.toUpperCase(), `${ext} hub`, `${ext} ecosystem`, 'topic authority'],
            aliases: [`${ext} topic hub`, `${ext} knowledge hub`],
            extension: ext.toUpperCase(),
            popularity: 92,
            searchWeight: 90,
            lastUpdated: new Date().toISOString(),
            quickActions: [
              { label: 'Explore Format Hub', action: 'navigate', route: { view: 'content-hub' as any, topic: ext } }
            ]
          });
        }
      }
    });

    // 5c. Index File Format Authority Guides (What Is a [FORMAT] File?)
    const formatList = getPrioritizedFormatList();
    formatList.forEach((fmt) => {
      const guide = getOrGenerateFormatGuide(fmt);
      const guideId = `format-guide-${fmt}`;
      const rec: SearchRecord = {
        id: guideId,
        slug: `file-extensions/${fmt}`,
        url: `https://www.anyfilex.com/file-extensions/${fmt}`,
        route: { view: 'format-guide', format: fmt },
        title: `What Is a ${guide.format} File? (${guide.fullName})`,
        description: guide.summary,
        type: 'guide',
        category: guide.category,
        keywords: [
          guide.format,
          `what is a ${fmt} file`,
          `${fmt} file format`,
          `${fmt} specifications`,
          guide.fullName,
          guide.mimeType,
          ...guide.seoMeta.keywords
        ],
        aliases: [
          `what is a ${fmt} file`,
          `what is ${fmt}`,
          `${fmt} specs`,
          `${fmt} format guide`,
          `open ${fmt} file`
        ],
        extension: guide.format,
        mime_type: guide.mimeType,
        popularity: 94,
        featured: true,
        searchWeight: 92,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: `Read ${guide.format} Format Guide`, action: 'open', route: { view: 'format-guide', format: fmt } },
          { label: `Inspect ${guide.format} File`, action: 'inspect', route: { view: 'file-analyzer' } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 6. Index Categories
    CATEGORIES_LIST.forEach((cat) => {
      const rec: SearchRecord = {
        id: `cat-${cat.id}`,
        slug: `category/${cat.id}`,
        url: `https://www.anyfilex.com/category/${cat.id}`,
        route: { view: 'extensions' },
        title: `${cat.name} File Extensions Directory`,
        description: cat.description,
        type: 'category',
        category: cat.name,
        keywords: [cat.name, cat.id, ...cat.popularExtensions, ...cat.popularExtensions.map((e) => `.${e}`)],
        aliases: [`${cat.name} extensions`, `all ${cat.name} file types`],
        popularity: 85,
        searchWeight: 80,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: `Browse ${cat.name} Extensions`, action: 'navigate', route: { view: 'extensions' } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 7. Index Universal Tools
    const toolsData: Array<{ id: string; title: string; desc: string; route: AppRoute; keywords: string[] }> = [
      {
        id: 'smart-workflows',
        title: 'Smart File Pipelines & Workflow Builder',
        desc: 'Chain multi-step conversions, resizing, compression, metadata sanitization, and verification in browser RAM',
        route: { view: 'workflows' },
        keywords: [
          'workflow',
          'smart workflow',
          'pipeline',
          'file pipeline',
          'batch workflow',
          'multi-step',
          'chain actions',
          'convert resize compress',
          'custom pipeline',
          'batch processing',
          'automate file operations'
        ]
      },
      {
        id: 'image-compressor',
        title: 'Image Compressor',
        desc: 'Compress JPG, PNG, WEBP, and HEIC images with real-time quality slider and batch ZIP download',
        route: { view: 'tool-detail', slug: 'image-compressor' } as any,
        keywords: ['image compressor', 'compress image', 'reduce image size', 'compress jpg', 'compress png', 'compress webp', 'photo compression', 'batch compress']
      },
      {
        id: 'image-resizer',
        title: 'Image Resizer',
        desc: 'Scale and resize images to exact pixel dimensions with aspect ratio lock and percentage presets',
        route: { view: 'tool-detail', slug: 'image-resizer' } as any,
        keywords: ['image resizer', 'resize image', 'scale image', 'change dimensions', 'photo resize', 'batch resize', 'aspect ratio']
      },
      {
        id: 'heic-to-jpg',
        title: 'HEIC to JPG Converter',
        desc: 'Convert Apple iPhone HEIC photos to universal JPG format with zero cloud uploads',
        route: { view: 'tool-detail', slug: 'heic-to-jpg' } as any,
        keywords: ['heic to jpg', 'convert heic', 'iphone photo to jpg', 'heif to jpg', 'apple photo converter']
      },
      {
        id: 'png-to-webp',
        title: 'PNG to WEBP Converter',
        desc: 'Convert PNG graphics to lightweight WebP format for fast web pages with alpha transparency preserved',
        route: { view: 'tool-detail', slug: 'png-to-webp' } as any,
        keywords: ['png to webp', 'convert png to webp', 'webp converter', 'optimize webp', 'transparent webp']
      },
      {
        id: 'webp-to-jpg',
        title: 'WEBP to JPG Converter',
        desc: 'Convert modern WebP images to universally compatible standard JPG format',
        route: { view: 'tool-detail', slug: 'webp-to-jpg' } as any,
        keywords: ['webp to jpg', 'convert webp to jpg', 'webp to jpeg', 'save webp as jpg']
      },
      {
        id: 'jpg-to-png',
        title: 'JPG to PNG Converter',
        desc: 'Convert compressed JPG pictures into lossless PNG format with zero re-compression artifacts',
        route: { view: 'tool-detail', slug: 'jpg-to-png' } as any,
        keywords: ['jpg to png', 'convert jpg to png', 'jpeg to png', 'lossless png']
      },
      {
        id: 'pdf-to-jpg',
        title: 'PDF to JPG Converter',
        desc: 'Extract and render PDF document pages into high-resolution JPG images with zero server uploads',
        route: { view: 'tool-detail', slug: 'pdf-to-jpg' } as any,
        keywords: ['pdf to jpg', 'convert pdf to jpg', 'pdf to image', 'pdf page extractor', 'pdf to jpeg']
      },
      {
        id: 'zip-creator',
        title: 'Online ZIP Creator',
        desc: 'Bundle multiple files and directory trees into a compressed .zip archive in browser memory',
        route: { view: 'tool-detail', slug: 'zip-creator' } as any,
        keywords: ['zip creator', 'create zip', 'zip files', 'compress zip', 'make zip archive']
      },
      {
        id: 'zip-extractor',
        title: 'ZIP Extractor & Inspector',
        desc: 'Inspect file trees and safely extract files from .zip archives with path traversal protection',
        route: { view: 'tool-detail', slug: 'zip-extractor' } as any,
        keywords: ['zip extractor', 'unzip files', 'extract zip', 'open zip', 'zip inspector']
      },
      {
        id: 'file-analyzer',
        title: 'File Intelligence Engine',
        desc: 'Deep binary inspection, extension mismatch detection, entropy analysis, and metadata diagnostics',
        route: { view: 'file-analyzer' },
        keywords: ['file analyzer', 'file intelligence engine', 'entropy analysis', 'mismatch detector', 'header inspector']
      },
      {
        id: 'file-identifier',
        title: 'File Format Identifier',
        desc: 'Inspect raw magic byte signatures to identify unknown files instantly in browser',
        route: { view: 'file-identifier' },
        keywords: ['file identifier', 'magic bytes', 'hex viewer', 'identify unknown file', 'what is this file', 'binary header', 'detect extension']
      },
      {
        id: 'metadata-viewer',
        title: 'Metadata Inspector',
        desc: 'View hidden EXIF, ID3, PDF, video, and audio metadata tags safely client-side',
        route: { view: 'metadata-viewer' },
        keywords: ['metadata viewer', 'exif inspector', 'id3 tags', 'pdf metadata', 'camera info', 'gps exif', 'file header']
      },
      {
        id: 'remove-metadata',
        title: 'Metadata Cleaner',
        desc: 'Strip hidden GPS tracking, author info, and camera serial numbers before sharing photos',
        route: { view: 'remove-metadata' },
        keywords: ['metadata cleaner', 'strip exif', 'remove gps', 'sanitize photo', 'privacy scrub', 'erase metadata']
      },
      {
        id: 'hash-generator',
        title: 'Hash Generator',
        desc: 'Generate SHA-256, MD5, and SHA-1 cryptographic checksums directly in browser',
        route: { view: 'hash-generator' },
        keywords: ['hash generator', 'sha256 calculator', 'md5 checksum', 'sha1 hash', 'file integrity', 'checksum generator']
      },
      {
        id: 'checksum-verifier',
        title: 'Checksum Verifier',
        desc: 'Compare file hash against target SHA-256 or MD5 checksum to verify download integrity',
        route: { view: 'checksum-verifier' },
        keywords: ['checksum verifier', 'compare hash', 'verify download', 'validate checksum', 'sha256 compare']
      },
      {
        id: 'mime-checker',
        title: 'MIME Type Checker',
        desc: 'Lookup Content-Type HTTP headers, RFC specifications, and browser content handlers',
        route: { view: 'mime-checker' },
        keywords: ['mime checker', 'content type lookup', 'mime type table', 'http content type', 'media type rfc']
      },
      {
        id: 'magic-byte-detector',
        title: 'Magic Byte Detector',
        desc: 'Analyze binary file headers to detect file extension spoofing and security risks',
        route: { view: 'magic-byte-detector' },
        keywords: ['magic byte detector', 'file header analysis', 'detect spoofed file', 'security byte check', 'hex header']
      },
      {
        id: 'all-tools',
        title: 'All File Utilities Hub',
        desc: 'Complete directory of 35+ free browser-based file analysis and conversion utilities',
        route: { view: 'tools' },
        keywords: ['file utilities', 'all tools', 'online file tools', 'anyfilex tools']
      },
      {
        id: 'seo-audit',
        title: 'SEO Audit & XML Sitemaps Hub',
        desc: 'Diagnostic verification and segmented XML sitemaps for 250+ file extensions',
        route: { view: 'seo-audit' },
        keywords: ['seo audit', 'sitemap generator', 'xml sitemaps', 'schema markup', 'core web vitals']
      }
    ];

    toolsData.forEach((t) => {
      const rec: SearchRecord = {
        id: `tool-${t.id}`,
        slug: `tools/${t.id}`,
        url: `https://www.anyfilex.com/tools/${t.id}`,
        route: t.route,
        title: t.title,
        description: t.desc,
        type: 'tool',
        category: 'Utilities',
        keywords: t.keywords,
        aliases: [t.title, ...t.keywords],
        popularity: 95,
        featured: true,
        searchWeight: 95,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: `Launch ${t.title}`, action: 'open', route: t.route }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 8. Index Format Comparisons
    const comparisonsList = [
      { slug: 'heic-vs-jpg', title: '.HEIC vs .JPG Format Comparison', ext1: 'HEIC', ext2: 'JPG', cat: 'Images' },
      { slug: 'png-vs-webp', title: '.PNG vs .WEBP Compression Benchmark', ext1: 'PNG', ext2: 'WEBP', cat: 'Images' },
      { slug: 'dwg-vs-dxf', title: '.DWG vs .DXF AutoCAD Comparison', ext1: 'DWG', ext2: 'DXF', cat: 'CAD & 3D' },
      { slug: 'psd-vs-tiff', title: '.PSD vs .TIFF Layer & Color Comparison', ext1: 'PSD', ext2: 'TIFF', cat: 'Images' },
      { slug: 'docx-vs-pdf', title: '.DOCX vs .PDF Document Standard', ext1: 'DOCX', ext2: 'PDF', cat: 'Documents' },
      { slug: 'zip-vs-7z', title: '.ZIP vs .7Z Archive Compression Ratio', ext1: 'ZIP', ext2: '7Z', cat: 'Archives' },
      { slug: 'step-vs-iges', title: '.STEP vs .IGES 3D CAD Exchange', ext1: 'STEP', ext2: 'IGES', cat: 'CAD & 3D' },
      { slug: 'mp4-vs-mkv', title: '.MP4 vs .MKV Video Container Breakdown', ext1: 'MP4', ext2: 'MKV', cat: 'Audio & Video' }
    ];

    comparisonsList.forEach((comp) => {
      const rec: SearchRecord = {
        id: `comp-${comp.slug}`,
        slug: `compare/${comp.slug}`,
        url: `https://www.anyfilex.com/compare/${comp.slug}`,
        route: { view: 'comparison-detail', slug: comp.slug },
        title: comp.title,
        description: `In-depth technical breakdown, file size benchmarks, quality analysis, and software compatibility between .${comp.ext1} and .${comp.ext2}.`,
        type: 'comparison',
        category: comp.cat,
        keywords: [comp.ext1, comp.ext2, `${comp.ext1} vs ${comp.ext2}`, `difference between ${comp.ext1} and ${comp.ext2}`],
        aliases: [`${comp.ext1} vs ${comp.ext2}`, `${comp.ext1} compared to ${comp.ext2}`],
        extension: comp.ext1,
        popularity: 88,
        searchWeight: 82,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'View Full Comparison', action: 'open', route: { view: 'comparison-detail', slug: comp.slug } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 9. Index MIME Types
    const mimeTypesList = [
      { mime: 'image/heic', ext: 'HEIC', desc: 'Apple High Efficiency Image Container MIME specification' },
      { mime: 'image/vnd.dwg', ext: 'DWG', desc: 'Autodesk AutoCAD Drawing binary MIME header' },
      { mime: 'image/vnd.adobe.photoshop', ext: 'PSD', desc: 'Adobe Photoshop Document raster image MIME type' },
      { mime: 'application/pdf', ext: 'PDF', desc: 'Adobe Portable Document Format binary MIME specification' },
      { mime: 'application/zip', ext: 'ZIP', desc: 'PKZIP Compressed Archive MIME type header' },
      { mime: 'application/json', ext: 'JSON', desc: 'JavaScript Object Notation text MIME specification' },
      { mime: 'model/step', ext: 'STEP', desc: 'Standard for the Exchange of Product model CAD data MIME' },
      { mime: 'video/mp4', ext: 'MP4', desc: 'MPEG-4 Part 14 Video Container MIME header' },
      { mime: 'audio/mpeg', ext: 'MP3', desc: 'MPEG Audio Layer III Compressed Audio MIME' }
    ];

    mimeTypesList.forEach((m) => {
      const rec: SearchRecord = {
        id: `mime-${m.ext.toLowerCase()}`,
        slug: `tools/mime-checker`,
        url: `https://www.anyfilex.com/tools/mime-checker`,
        route: { view: 'mime-checker' },
        title: `MIME Type: ${m.mime} (.${m.ext})`,
        description: m.desc,
        type: 'mime_type',
        category: 'HTTP & MIME',
        keywords: [m.mime, m.ext, `.${m.ext}`, 'content type header', 'http mime'],
        aliases: [m.mime, `mime type for ${m.ext}`],
        mime_type: m.mime,
        extension: m.ext,
        popularity: 80,
        searchWeight: 78,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'Check Content-Type Specification', action: 'inspect', route: { view: 'mime-checker' } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    // 10. Security Risk Pages
    const securityRisks = [
      { ext: 'EXE', risk: 'High', desc: 'Windows Executable file format. Potential malware vector requiring byte header inspection.' },
      { ext: 'BAT', risk: 'High', desc: 'Windows Batch command file. Unsanitized script execution risk.' },
      { ext: 'JS', risk: 'Medium', desc: 'JavaScript code file. Client or Node.js execution vector.' },
      { ext: 'ZIP', risk: 'Medium', desc: 'Archive file capable of directory traversal (ZipSlip) or nested malware payloads.' }
    ];

    securityRisks.forEach((sec) => {
      const rec: SearchRecord = {
        id: `sec-${sec.ext.toLowerCase()}`,
        slug: `security/${sec.ext.toLowerCase()}`,
        url: `https://www.anyfilex.com/file-extensions/${sec.ext.toLowerCase()}`,
        route: { view: 'extension-detail', ext: sec.ext.toLowerCase() },
        title: `Security Risk Rating: .${sec.ext} (${sec.risk} Risk)`,
        description: sec.desc,
        type: 'security',
        category: 'Security Analysis',
        keywords: [sec.ext, `.${sec.ext}`, 'security risk', 'virus check', 'malware rating', 'magic byte security'],
        aliases: [`is .${sec.ext} safe`, `.${sec.ext} virus risk`, `danger rating .${sec.ext}`],
        extension: sec.ext,
        popularity: 82,
        searchWeight: 80,
        lastUpdated: new Date().toISOString(),
        quickActions: [
          { label: 'Scan Byte Header', action: 'inspect', route: { view: 'magic-byte-detector' } }
        ]
      };
      this.indexMap.set(rec.id, rec);
    });

    this.recordsCache = Array.from(this.indexMap.values());
    this.isInitialized = true;
  }

  /**
   * Registers a single Extension record into the search index dynamically.
   */
  public registerExtensionRecord(e: FileTypeInfo): SearchRecord {
    const rec: SearchRecord = {
      id: `ext-${e.extension.toLowerCase()}`,
      slug: `file-extensions/${e.extension.toLowerCase()}`,
      url: `https://www.anyfilex.com/file-extensions/${e.extension.toLowerCase()}`,
      route: { view: 'extension-detail', ext: e.extension.toLowerCase() },
      title: `.${e.extension.toUpperCase()} File Extension - ${e.name}`,
      description: e.description,
      type: 'extension',
      category: e.category,
      keywords: [
        e.extension,
        `.${e.extension}`,
        e.name,
        e.category,
        ...(e.popularApps ? e.popularApps.map((a) => a.name) : []),
        ...(e.conversions ? e.conversions.map((c) => c.targetExtension) : []),
        e.mimeType || ''
      ],
      aliases: [
        e.name,
        `.${e.extension} file`,
        `how to open .${e.extension}`,
        `open ${e.extension}`,
        `${e.extension} format`,
        `${e.extension} viewer`,
        `what is .${e.extension}`
      ],
      extension: e.extension,
      mime_type: e.mimeType,
      software: e.popularApps ? e.popularApps.map((a) => a.name) : [],
      popularity: e.dangerRating === 'Low Risk' ? 95 : 85,
      featured: true,
      searchWeight: 100,
      lastUpdated: new Date().toISOString(),
      quickActions: [
        { label: `View .${e.extension.toUpperCase()} Specs`, action: 'open', route: { view: 'extension-detail', ext: e.extension.toLowerCase() } },
        { label: `Convert .${e.extension.toUpperCase()}`, action: 'convert', route: { view: 'converter-detail', id: `${e.extension.toLowerCase()}-to-pdf` } },
        { label: `Repair .${e.extension.toUpperCase()}`, action: 'repair', route: { view: 'repair-detail', id: `corrupted-${e.extension.toLowerCase()}` } },
        { label: 'Identify Header Bytes', action: 'inspect', route: { view: 'file-identifier' } }
      ]
    };

    this.indexMap.set(rec.id, rec);
    this.recordsCache = Array.from(this.indexMap.values());
    return rec;
  }

  /**
   * Universal Search Method across all 11 content types with scoring, intent normalization, fuzzy matching & grouping.
   */
  public search(rawQuery: string, options: SearchOptions = {}): GroupedSearchResults {
    if (!this.isInitialized) {
      this.initializeIndex();
    }

    const { type = 'all', category, limit = 30 } = options;
    const cleanQuery = rawQuery.trim().toLowerCase();

    if (!cleanQuery) {
      return this.getEmptyStateResults(type, limit);
    }

    // 1. Normalize Intent & Strip Questions (e.g., "what opens heic?" -> "heic", "how to open dwg?" -> "dwg")
    const queryTerm = cleanQuery
      .replace(/^(what opens|how to open|how to repair|how to convert|what is|open|fix|convert|repair|view)\s+/i, '')
      .replace(/\s+(file|format|viewer|converter|editor|online|free|tool|repair|\?)$/gi, '')
      .trim() || cleanQuery;

    const noDotTerm = queryTerm.replace(/^\./, '');

    const scoredRecords: Array<{ record: SearchRecord; score: number }> = [];

    for (const rec of this.recordsCache) {
      // Type Filter
      if (type !== 'all') {
        if (type === 'extensions' && rec.type !== 'extension') continue;
        if (type === 'software' && rec.type !== 'software') continue;
        if (type === 'converters' && rec.type !== 'converter') continue;
        if (type === 'tools' && rec.type !== 'tool') continue;
        if (type === 'repair' && rec.type !== 'repair') continue;
        if (type === 'guides' && rec.type !== 'guide' && rec.type !== 'blog') continue;
        if (type !== 'extensions' && type !== 'software' && type !== 'converters' && type !== 'tools' && type !== 'repair' && type !== 'guides' && rec.type !== type) continue;
      }

      // Category Filter
      if (category && category !== 'All' && rec.category.toLowerCase() !== category.toLowerCase()) {
        continue;
      }

      let score = 0;
      const recExt = (rec.extension || '').toLowerCase();
      const recTitle = rec.title.toLowerCase();
      const recDesc = rec.description.toLowerCase();

      // --- SCORING RULES ---

      // 1. Exact Extension Match (e.g. user typed "heic" or ".heic")
      if (recExt && (recExt === noDotTerm || `.${recExt}` === cleanQuery)) {
        score += 2000;
      }

      // 2. Exact Title / Converter Pattern Match (e.g. "heic to jpg" matching HEIC to JPG converter)
      if (recTitle.includes(cleanQuery)) {
        score += 1000;
      } else if (recTitle.includes(noDotTerm)) {
        score += 800;
      }

      // 3. Prefix Match on Extension or Title
      if (recExt && recExt.startsWith(noDotTerm)) {
        score += 600;
      }
      if (recTitle.startsWith(cleanQuery) || recTitle.startsWith(noDotTerm)) {
        score += 500;
      }

      // 4. Keyword / Alias Matches
      for (const kw of rec.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === cleanQuery || kwLower === noDotTerm) {
          score += 400;
        } else if (kwLower.includes(noDotTerm)) {
          score += 200;
        }
      }

      for (const alias of rec.aliases) {
        const aliasLower = alias.toLowerCase();
        if (aliasLower === cleanQuery || aliasLower === noDotTerm) {
          score += 400;
        } else if (aliasLower.includes(noDotTerm)) {
          score += 180;
        }
      }

      // 5. Software match
      if (rec.software && rec.software.some((sw) => sw.toLowerCase().includes(noDotTerm))) {
        score += 250;
      }

      // 6. MIME Type match
      if (rec.mime_type && rec.mime_type.toLowerCase().includes(noDotTerm)) {
        score += 300;
      }

      // 7. Description Substring match
      if (recDesc.includes(noDotTerm)) {
        score += 100;
      }

      // 8. Category match
      if (rec.category.toLowerCase().includes(noDotTerm)) {
        score += 50;
      }

      // 9. Fuzzy / Typo Allowance (Sub-character matching for common typos like "heif" vs "heic", "jepg" vs "jpeg")
      if (score === 0 && options.fuzzy !== false) {
        if (recExt && (this.levenshteinDistance(recExt, noDotTerm) <= 1 || (noDotTerm.length >= 3 && recExt.includes(noDotTerm.slice(0, 2))))) {
          score += 120;
        }
      }

      if (score > 0) {
        // Add popularity weight
        score += Math.round(rec.popularity / 10);
        scoredRecords.push({ record: rec, score });
      }
    }

    // Sort descending by calculated relevance score
    scoredRecords.sort((a, b) => b.score - a.score);

    const sortedList = scoredRecords.map((item) => item.record).slice(0, limit);

    return this.groupResults(sortedList);
  }

  /**
   * Returns default suggested/popular items when query is empty.
   */
  private getEmptyStateResults(type: string, limit: number): GroupedSearchResults {
    let filtered = this.recordsCache;
    if (type !== 'all') {
      if (type === 'extensions') filtered = filtered.filter((r) => r.type === 'extension');
      if (type === 'software') filtered = filtered.filter((r) => r.type === 'software');
      if (type === 'converters') filtered = filtered.filter((r) => r.type === 'converter');
      if (type === 'tools') filtered = filtered.filter((r) => r.type === 'tool');
      if (type === 'repair') filtered = filtered.filter((r) => r.type === 'repair');
      if (type === 'guides') filtered = filtered.filter((r) => r.type === 'guide' || r.type === 'blog');
    }

    const sorted = [...filtered].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
    return this.groupResults(sorted);
  }

  /**
   * Helper to structure flat list into category buckets.
   */
  private groupResults(records: SearchRecord[]): GroupedSearchResults {
    const extensions = records.filter((r) => r.type === 'extension');
    const software = records.filter((r) => r.type === 'software');
    const converters = records.filter((r) => r.type === 'converter');
    const tools = records.filter((r) => r.type === 'tool');
    const repair = records.filter((r) => r.type === 'repair');
    const guides = records.filter((r) => r.type === 'guide' || r.type === 'blog');
    const categories = records.filter((r) => r.type === 'category');
    const comparisons = records.filter((r) => r.type === 'comparison');

    return {
      extensions,
      software,
      converters,
      tools,
      repair,
      guides,
      categories,
      comparisons,
      allSorted: records,
      totalCount: records.length
    };
  }

  /**
   * Levenshtein Distance algorithm for fuzzy misspelling tolerance.
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}

export const searchEngine = new SearchEngine();
