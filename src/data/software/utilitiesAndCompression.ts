import { SoftwareInfo } from '../../types';

export const UTILITIES_AND_COMPRESSION_SOFTWARE: SoftwareInfo[] = [
  {
    id: '7-zip',
    name: '7-Zip Archive Utility',
    developer: 'Igor Pavlov',
    category: 'Utilities & Compression',
    description: 'Free open-source file archiver with high compression ratio and multi-format support.',
    longDescription: '7-Zip is a free open-source utility with a high compression ratio. It supports its native 7z archive format with LZMA2 compression, as well as unpacking ZIP, RAR, TAR, GZ, ISO, CAB, and MSI installers.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://7-zip.org',
    downloadUrl: 'https://7-zip.org/download.html',
    supportedExtensions: ['7Z', 'ZIP', 'RAR', 'TAR', 'GZ', 'ISO', 'CAB', 'ARJ', 'DEB', 'RPM', 'DMG', 'ZST', 'XZ', 'BZ2'],
    rating: 4.8,
    reviewCount: 78000,
    features: [
      'High compression ratio in 7z format with LZMA compression',
      'Strong AES-256 encryption for secure file protection',
      'Self-extracting capability for 7z format',
      'Windows Shell integration in context menus',
      'Powerful command line utility for script automation'
    ],
    alternatives: [
      { name: 'WinRAR', slug: 'winrar', description: 'Popular archive manager with RAR5 support.' },
      { name: 'PeaZip', slug: 'peazip', description: 'Open source file archiver with clean GUI.' },
      { name: 'The Unarchiver', slug: 'the-unarchiver', description: 'Best free archive unpacker for macOS.' }
    ],
    tutorials: [
      { title: 'How to Extract 7Z and RAR Archives with 7-Zip', description: 'Step-by-step instructions to unpack multi-volume 7z/rar files using 7-Zip.', readTime: '3 min' },
      { title: 'Creating Password Protected Encrypted 7Z Files', description: 'Enable AES-256 encryption and header masking when compressing archives.', readTime: '4 min' }
    ]
  },
  {
    id: 'winrar',
    name: 'WinRAR Archiver',
    developer: 'win.rar GmbH / Eugene Roshal',
    category: 'Utilities & Compression',
    description: 'Powerful archive manager for Windows supporting RAR, ZIP, and multi-volume archives.',
    longDescription: 'WinRAR is a powerful archive manager. It can backup your data and reduce the size of email attachments, decompress RAR, ZIP and other files downloaded from Internet and create new archives in RAR and ZIP file format.',
    supportedOS: ['windows', 'android'],
    priceType: 'Paid',
    priceText: '40-Day Trial / $29.00',
    websiteUrl: 'https://win-rar.com',
    downloadUrl: 'https://win-rar.com/download.html',
    supportedExtensions: ['RAR', 'ZIP', '7Z', 'TAR', 'GZ', 'ISO', 'CAB', 'ARJ', 'BZ2', 'UUE', 'JAR'],
    rating: 4.7,
    reviewCount: 82000,
    features: [
      'Native creation of proprietary RAR and RAR5 archive formats',
      'Recovery record volume generation for repairing corrupted archives',
      'Benchmark speed test for testing CPU compression performance'
    ],
    alternatives: [
      { name: '7-Zip', slug: '7-zip', description: 'Free open source archiver.' },
      { name: 'WinZip', slug: 'winzip', description: 'Classic archive compression app.' }
    ]
  },
  {
    id: 'the-unarchiver',
    name: 'The Unarchiver for Mac',
    developer: 'MacPaw',
    category: 'Utilities & Compression',
    description: 'Free archive unpacker for macOS supporting RAR, Zip, 7z, Tar, Gzip, and ISO.',
    longDescription: 'The Unarchiver is a small and easy to use program that can unarchive many different kinds of archive files. It will open common formats like Zip, RAR, 7z, Tar, Gzip and Bzip2.',
    supportedOS: ['mac'],
    priceType: 'Free',
    priceText: 'Free Mac App',
    websiteUrl: 'https://theunarchiver.com',
    downloadUrl: 'https://apps.apple.com/app/the-unarchiver/id425424353',
    supportedExtensions: ['RAR', 'ZIP', '7Z', 'TAR', 'GZ', 'ISO', 'SIT', 'EXE', 'CAB', 'LZH'],
    rating: 4.8,
    reviewCount: 42000,
    features: [
      'Unpacks dozens of old legacy compression formats (StuffIt, LHA)',
      'Handles non-Latin character file encodings seamlessly',
      'Integrates directly into macOS Finder double-click action'
    ],
    alternatives: [
      { name: 'Keka', slug: 'keka', description: 'macOS file archiver.' }
    ]
  },
  {
    id: 'peazip',
    name: 'PeaZip Utility',
    developer: 'Giorgio Tani',
    category: 'Utilities & Compression',
    description: 'Free open source file archiver utility for Windows, Linux, and macOS.',
    longDescription: 'PeaZip is a free file archiver utility, based on Open Source technologies of 7-Zip, p7zip, FreeARC, PAQ, and PEA. Create 7Z, ARC, BZ2, GZ, PEA, TAR, WIM, and ZIP archives.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://peazip.github.io',
    downloadUrl: 'https://peazip.github.io/peazip-download-windows.html',
    supportedExtensions: ['7Z', 'ZIP', 'RAR', 'PEA', 'TAR', 'GZ', 'ISO', 'CAB', 'ZST', 'BR'],
    rating: 4.7,
    reviewCount: 18000,
    features: [
      'Encrypted password manager and secure file deletion shredder',
      'Checksum calculator (MD5, SHA256, CRC32)',
      'Clean modern cross-platform user interface'
    ],
    alternatives: [
      { name: '7-Zip', slug: '7-zip', description: 'Open source compression.' }
    ]
  },
  {
    id: 'rufus',
    name: 'Rufus Bootable USB',
    developer: 'Pete Batard',
    category: 'Utilities & Compression',
    description: 'Lightweight utility to format and create bootable USB flash drives from ISO images.',
    longDescription: 'Rufus is a utility that helps format and create bootable USB flash drives, such as USB keys/pendrives, memory sticks, etc. Essential for installing Windows 11 or Linux OS ISOs.',
    supportedOS: ['windows'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://rufus.ie',
    downloadUrl: 'https://rufus.ie/en/',
    supportedExtensions: ['ISO', 'IMG', 'VHD', 'RAW'],
    rating: 4.9,
    reviewCount: 65000,
    features: [
      'Creates bootable Windows 11 USB installer bypassing TPM/RAM requirements',
      'Support for UEFI and legacy BIOS partition tables (GPT and MBR)',
      '2x faster than Microsoft official Media Creation Tool'
    ],
    alternatives: [
      { name: 'BalenaEtcher', slug: 'balena-etcher', description: 'Cross-platform SD card/USB flasher.' }
    ]
  },
  {
    id: 'balena-etcher',
    name: 'balenaEtcher',
    developer: 'Balena Inc.',
    category: 'Utilities & Compression',
    description: 'Flash OS images to SD cards & USB drives, safely and simply on Windows, Mac, and Linux.',
    longDescription: 'balenaEtcher is a free and open-source utility used for writing image files such as .iso and .img files, as well as zipped folders onto storage media to create live SD cards and USB flash drives.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://etcher.balena.io/',
    downloadUrl: 'https://etcher.balena.io/',
    supportedExtensions: ['ISO', 'IMG', 'ZIP', 'GZ', 'XZ', 'DMG', 'RAW'],
    rating: 4.7,
    reviewCount: 39000,
    features: [
      'Validated flashing prevents writing on corrupted SD cards',
      'Hard drive safety check prevents accidental wiping of main OS drive',
      '3-step intuitive user interface'
    ],
    alternatives: [
      { name: 'Rufus', slug: 'rufus', description: 'Windows USB bootable utility.' }
    ]
  },
  {
    id: 'wireshark',
    name: 'Wireshark Network Analyzer',
    developer: 'Wireshark Foundation',
    category: 'Utilities & Compression',
    description: 'World premier network packet analyzer for troubleshooting, analysis, and security auditing.',
    longDescription: 'Wireshark is the world’s foremost and widely-used network protocol analyzer. It lets you see what’s happening on your network at a microscopic level.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://wireshark.org',
    downloadUrl: 'https://wireshark.org/download.html',
    supportedExtensions: ['PCAP', 'PCAPNG', 'CAP', 'PKT', 'LOG'],
    rating: 4.9,
    reviewCount: 38000,
    features: [
      'Deep inspection of hundreds of network protocols',
      'Live packet capture and offline analysis',
      'Rich display filter language for isolating network traffic'
    ],
    alternatives: [
      { name: 'Fiddler', slug: 'fiddler', description: 'HTTP debugging proxy.' }
    ]
  },
  {
    id: 'filezilla',
    name: 'FileZilla FTP Client',
    developer: 'Tim Kosse / FileZilla Project',
    category: 'Utilities & Compression',
    description: 'Free open source FTP, FTPS, and SFTP file transfer client for cross-platform servers.',
    longDescription: 'FileZilla Client is a free, open source FTP, FTPS and SFTP client with a lot of features. Supports tabbed user interface, bookmarking, and drag & drop file transfers.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://filezilla-project.org',
    downloadUrl: 'https://filezilla-project.org/download.php?type=client',
    supportedExtensions: ['FTP', 'SFTP', 'XML', 'LOG'],
    rating: 4.7,
    reviewCount: 58000,
    features: [
      'Supports FTP, FTP over SSL/TLS (FTPS) and SSH File Transfer Protocol (SFTP)',
      'Cross-platform tabbed file manager interface',
      'Directory comparison and filename filter rules'
    ],
    alternatives: [
      { name: 'Cyberduck', slug: 'cyberduck', description: 'Cloud storage and SFTP browser.' },
      { name: 'WinSCP', slug: 'winscp', description: 'Windows SFTP and FTP client.' }
    ]
  }
];
