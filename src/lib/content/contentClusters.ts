import { ContentCluster } from './types';

export const CONTENT_CLUSTERS: ContentCluster[] = [
  {
    id: 'cluster-a-formats',
    clusterKey: 'cluster-a-formats',
    title: 'Cluster A — File Format Guides',
    shortName: 'Format Guides',
    description: 'Comprehensive technical breakdowns of container architectures, compression algorithms, internal structure, and specifications.',
    contentType: 'format-guide',
    iconName: 'FileText',
    badgeColor: 'blue',
    exampleTopics: ['What Is a HEIC File?', 'What Is a WEBP File?', 'What Is an AVIF File?', 'What Is a TIFF File?', 'What Is a DOCX File?', 'What Is an XLSX File?', 'What Is a ZIP File?'],
    targetAudience: 'Users researching file extensions, technical specs, developers, and media professionals.'
  },
  {
    id: 'cluster-b-how-to-open',
    clusterKey: 'cluster-b-how-to-open',
    title: 'Cluster B — How to Open Files',
    shortName: 'How to Open',
    description: 'OS-specific step-by-step instructions for viewing and executing files on Windows 11/10, macOS, Linux, iOS, and Android.',
    contentType: 'how-to',
    iconName: 'FolderOpen',
    badgeColor: 'emerald',
    exampleTopics: ['How to Open a HEIC File', 'How to Open a WEBP File', 'How to Open an AVIF File', 'How to Open a JSON File', 'How to Open a RAR File'],
    targetAudience: 'Users encountering unrecognized file types on specific operating systems.'
  },
  {
    id: 'cluster-c-conversions',
    clusterKey: 'cluster-c-conversions',
    title: 'Cluster C — Conversion Guides',
    shortName: 'Conversion Guides',
    description: 'Transforming files between formats with zero quality loss, connected directly to in-browser AnyFileX transformation tools.',
    contentType: 'conversion-guide',
    iconName: 'RefreshCw',
    badgeColor: 'purple',
    exampleTopics: ['How to Convert HEIC to JPG', 'How to Convert PNG to WEBP', 'How to Convert WEBP to JPG', 'How to Convert JPG to PDF'],
    targetAudience: 'Users seeking immediate format transformation without privacy leaks or third-party cloud uploads.'
  },
  {
    id: 'cluster-d-comparisons',
    clusterKey: 'cluster-d-comparisons',
    title: 'Cluster D — Format Comparisons',
    shortName: 'Format Comparisons',
    description: 'Side-by-side technical benchmarks analyzing compression ratios, visual fidelity, color depth, browser support, and patents.',
    contentType: 'comparison',
    iconName: 'GitCompare',
    badgeColor: 'indigo',
    exampleTopics: ['HEIC vs JPG', 'WEBP vs PNG', 'AVIF vs WEBP', 'JPG vs PNG', 'ZIP vs RAR'],
    targetAudience: 'Designers, engineers, and digital archivists deciding on optimal asset storage.'
  },
  {
    id: 'cluster-e-troubleshooting',
    clusterKey: 'cluster-e-troubleshooting',
    title: 'Cluster E — Troubleshooting & File Repair',
    shortName: 'Troubleshooting',
    description: 'Diagnosing corrupted file headers, truncated streams, mismatched extensions, and black-screen decoding failures.',
    contentType: 'troubleshooting',
    iconName: 'AlertTriangle',
    badgeColor: 'amber',
    exampleTopics: ['Why Won’t My JPG File Open?', 'Why Is My HEIC File Not Opening?', 'How to Fix a File With the Wrong Extension', 'How to Check if a File Is Corrupted', 'Why Is My ZIP File Not Opening?'],
    targetAudience: 'Users facing error dialogues, 0-byte corruptions, or broken file transfers.'
  },
  {
    id: 'cluster-f-technical',
    clusterKey: 'cluster-f-technical',
    title: 'Cluster F — Technical File Intelligence',
    shortName: 'Technical Guides',
    description: 'In-depth educational guides explaining magic bytes, hexadecimal signatures, MIME standards, entropy calculation, and cryptographic hashes.',
    contentType: 'technical-guide',
    iconName: 'Cpu',
    badgeColor: 'cyan',
    exampleTopics: ['What Are Magic Bytes?', 'What Is a File Signature?', 'What Is MIME Type?', 'What Is File Entropy?', 'What Is SHA-256?', 'How Does File Type Detection Work?'],
    targetAudience: 'Security analysts, forensics students, systems programmers, and curious tech enthusiasts.'
  },
  {
    id: 'cluster-g-security',
    clusterKey: 'cluster-g-security',
    title: 'Cluster G — File Security & Malware Prevention',
    shortName: 'Security Guides',
    description: 'Factual, evidence-based security guides on extension spoofing, executable cloaking, decompression bombs, and macro vulnerabilities.',
    contentType: 'security-guide',
    iconName: 'ShieldCheck',
    badgeColor: 'rose',
    exampleTopics: ['How to Detect a File Extension Spoof', 'Can a JPG File Actually Be an EXE?', 'How to Verify a Downloaded File', 'What Is a ZIP Bomb?', 'What Are Macro-Enabled Office Files?'],
    targetAudience: 'Enterprise IT staff, compliance auditors, and safety-conscious downloaders.'
  },
  {
    id: 'cluster-h-software',
    clusterKey: 'cluster-h-software',
    title: 'Cluster H — Software Compatibility & Ecosystems',
    shortName: 'Software Guides',
    description: 'Ecosystem matrices mapping desktop, mobile, and web applications capable of reading, editing, and rasterizing target formats.',
    contentType: 'software-compatibility',
    iconName: 'Layers',
    badgeColor: 'teal',
    exampleTopics: ['What Programs Open HEIC Files?', 'What Programs Open WEBP Files?', 'Can Windows Open HEIC Files?', 'Can macOS Open RAR Files?'],
    targetAudience: 'Users seeking verified free, open-source, or commercial programs to work with their files.'
  }
];

export function getClusterById(clusterId: string): ContentCluster | undefined {
  return CONTENT_CLUSTERS.find(c => c.id === clusterId || c.clusterKey === clusterId);
}

export function getClusterByContentType(type: string): ContentCluster | undefined {
  return CONTENT_CLUSTERS.find(c => c.contentType === type);
}
