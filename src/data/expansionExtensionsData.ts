import type { ExtensionSchema } from '../lib/database/extensionEngine';

/**
 * Expansion batch 3a (2026-10-17): 51 researched ExtensionSchema records.
 * Every record was researched against public format documentation
 * (Wikipedia, FileInfo, vendor specs, signature databases) with the
 * no-fabrication rule: software, MIME types, developers, and risk notes
 * are stated only where publicly documented.
 */
export const EXPANSION_EXTENSIONS_DATA: ExtensionSchema[] = [
  // ---------- System & Executables ----------
  {
    slug: 'exe',
    extension: 'EXE',
    title: '.EXE File Extension - Windows Executable Program Format',
    description: 'EXE is the standard executable program format for Microsoft Windows. It contains machine code in the Portable Executable (PE) format that the Windows loader runs directly, and it opens with MZ (4D 5A) magic bytes.',
    category: 'System & Executables',
    mime: 'application/x-msdownload',
    developer: 'Microsoft Corporation',
    software: ['Windows File Explorer', '7-Zip', 'Resource Hacker'],
    related_extensions: ['dll', 'msi', 'bat'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'High Risk',
      canContainMalware: true,
      tips: ['Never run EXE files from untrusted emails or downloads', 'Verify the publisher signature before executing unknown installers']
    },
    keywords: ['exe file', 'open exe', 'what is an exe file', 'windows executable']
  },
  {
    slug: 'dll',
    extension: 'DLL',
    title: '.DLL File Extension - Windows Dynamic Link Library',
    description: 'DLL (Dynamic Link Library) files are shared code libraries loaded by Windows programs at runtime. Like EXE files they use the Portable Executable format with MZ magic bytes, but they are libraries, not standalone programs.',
    category: 'System & Executables',
    mime: 'application/x-msdownload',
    developer: 'Microsoft Corporation',
    software: ['Microsoft Visual Studio', 'Dependency Walker', '7-Zip'],
    related_extensions: ['exe', 'msi', 'bat'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Never place unknown DLL files in system folders or application directories', 'DLL hijacking attacks replace legitimate libraries with malicious ones']
    },
    keywords: ['dll file', 'open dll', 'what is a dll file', 'dynamic link library']
  },
  {
    slug: 'msi',
    extension: 'MSI',
    title: '.MSI File Extension - Windows Installer Package',
    description: 'MSI is the installer package format for Windows Installer. It stores installation files, registry changes, and setup logic in a compound binary container (the same OLE structure as legacy Office documents).',
    category: 'System & Executables',
    mime: 'application/x-msi',
    developer: 'Microsoft Corporation',
    software: ['Windows Installer', '7-Zip', 'Orca'],
    related_extensions: ['exe', 'dll', 'bat'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['MSI packages install with elevated privileges and can run custom actions', 'Only run installers downloaded from the vendor official site']
    },
    keywords: ['msi file', 'open msi', 'windows installer package', 'install msi']
  },
  {
    slug: 'apk',
    extension: 'APK',
    title: '.APK File Extension - Android Application Package',
    description: 'APK (Android Package) is the installable app format for Android. It is a ZIP-based container holding compiled Dalvik/ART bytecode, resources, assets, and the app manifest.',
    category: 'System & Executables',
    mime: 'application/vnd.android.package-archive',
    developer: 'Google / Open Handset Alliance',
    software: ['Android OS', '7-Zip', 'APKTool'],
    related_extensions: ['exe', 'msi', 'zip'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Sideloaded APK files outside the Play Store are a major malware vector', 'Check requested permissions before installing any APK']
    },
    keywords: ['apk file', 'open apk', 'android apk', 'install apk']
  },
  {
    slug: 'deb',
    extension: 'DEB',
    title: '.DEB File Extension - Debian Software Package',
    description: 'DEB is the software package format for Debian and Debian-based Linux distributions such as Ubuntu. It is an ar archive containing control metadata and the packaged files, starting with the !<arch> signature.',
    category: 'System & Executables',
    mime: 'application/vnd.debian.binary-package',
    developer: 'Debian Project',
    software: ['APT Package Manager', 'dpkg', '7-Zip'],
    related_extensions: ['rpm', 'tar', 'gz'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['DEB maintainer scripts execute as root during installation', 'Install packages only from official distribution repositories']
    },
    keywords: ['deb file', 'open deb', 'debian package', 'install deb ubuntu']
  },
  {
    slug: 'rpm',
    extension: 'RPM',
    title: '.RPM File Extension - Red Hat Package Manager File',
    description: 'RPM is the software package format for Red Hat-based Linux distributions such as Fedora, RHEL, and openSUSE. It begins with the ED AB EE DB magic bytes and contains installable files plus dependency metadata.',
    category: 'System & Executables',
    mime: 'application/x-rpm',
    developer: 'Red Hat',
    software: ['RPM Package Manager', 'DNF', '7-Zip'],
    related_extensions: ['deb', 'tar', 'gz'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['RPM scriptlets can execute code during installation', 'Verify package signatures and use official repositories']
    },
    keywords: ['rpm file', 'open rpm', 'red hat package', 'install rpm']
  },
  {
    slug: 'reg',
    extension: 'REG',
    title: '.REG File Extension - Windows Registry Entry File',
    description: 'REG files are text files that contain Windows Registry keys and values. Double-clicking one merges the entries into the registry, which is how Windows applies configuration tweaks and fixes.',
    category: 'Code & Data',
    mime: 'text/plain',
    developer: 'Microsoft Corporation',
    software: ['Windows Registry Editor', 'Notepad'],
    related_extensions: ['ini', 'bat', 'ps1'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: false,
      tips: ['Merging a REG file changes system configuration immediately', 'Preview REG files in a text editor and back up the registry first']
    },
    keywords: ['reg file', 'open reg', 'windows registry file', 'merge reg file']
  },
  // ---------- Archives ----------
  {
    slug: 'xar',
    extension: 'XAR',
    title: '.XAR File Extension - Extensible Archive Format',
    description: 'XAR (eXtensible ARchive) is an open archive format developed for macOS that stores compressed files with an XML table of contents. It begins with the xar! signature and is handled by the bsdtar utility on macOS.',
    category: 'Archives',
    mime: 'application/x-xar',
    developer: 'Apple Inc. / OpenDarwin project',
    software: ['macOS Terminal', 'The Unarchiver', '7-Zip'],
    related_extensions: ['zip', 'tar', 'dmg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Archives can bundle executables with misleading names']
    },
    keywords: ['xar file', 'open xar', 'extensible archive', 'mac xar archive']
  },
  {
    slug: 'cpio',
    extension: 'CPIO',
    title: '.CPIO File Extension - Unix Archive Format',
    description: 'CPIO is a classic Unix archive format that stores file collections, commonly used for Linux initramfs images and RPM payloads. New-format archives begin with the 070701 magic string.',
    category: 'Archives',
    mime: 'application/x-cpio',
    developer: 'POSIX / GNU Project',
    software: ['GNU cpio', '7-Zip', 'PeaZip'],
    related_extensions: ['tar', 'gz', 'rpm'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Archives can bundle executables with misleading names']
    },
    keywords: ['cpio file', 'open cpio', 'cpio archive', 'linux cpio']
  },
  {
    slug: 'arj',
    extension: 'ARJ',
    title: '.ARJ File Extension - Archived by Robert Jung',
    description: 'ARJ is a compressed archive format created by Robert K. Jung that was popular in the DOS era. Modern 7-Zip and PeaZip can still extract ARJ archives, which start with the 60 EA signature.',
    category: 'Archives',
    mime: 'application/x-arj',
    developer: 'Robert K. Jung',
    software: ['7-Zip', 'PeaZip', 'ARJ Software'],
    related_extensions: ['zip', 'rar', '7z'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Legacy ARJ archives sometimes carry old DOS executables']
    },
    keywords: ['arj file', 'open arj', 'arj archive', 'extract arj']
  },
  {
    slug: 'lzh',
    extension: 'LZH',
    title: '.LZH File Extension - LHA Compressed Archive',
    description: 'LZH is a compressed archive format from the LHA archiver by Haruyasu Yoshizaki, widely used on Japanese PCs and the Amiga. Its entries carry -lh- method markers in the header.',
    category: 'Archives',
    mime: 'application/x-lzh-compressed',
    developer: 'Haruyasu Yoshizaki (LHA)',
    software: ['7-Zip', 'PeaZip', 'LHA'],
    related_extensions: ['zip', 'rar', '7z'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Legacy LZH archives sometimes carry old DOS executables']
    },
    keywords: ['lzh file', 'open lzh', 'lha archive', 'extract lzh']
  },
  {
    slug: 'zoo',
    extension: 'ZOO',
    title: '.ZOO File Extension - Zoo Archive Format',
    description: 'ZOO is a legacy compressed archive format created by Rahul Dhesi in the 1980s. It begins with the ZOO signature and is still extractable with 7-Zip.',
    category: 'Archives',
    mime: 'application/x-zoo',
    developer: 'Rahul Dhesi',
    software: ['7-Zip', 'PeaZip'],
    related_extensions: ['zip', 'arj', 'rar'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Legacy ZOO archives sometimes carry old DOS executables']
    },
    keywords: ['zoo file', 'open zoo', 'zoo archive', 'extract zoo']
  },
  {
    slug: 'sit',
    extension: 'SIT',
    title: '.SIT File Extension - StuffIt Archive',
    description: 'SIT is the classic StuffIt archive format for Macintosh files, originally developed by Aladdin Systems and now maintained by Smith Micro. It preserved Mac resource forks that ZIP could not.',
    category: 'Archives',
    mime: 'application/x-stuffit',
    developer: 'Smith Micro (originally Aladdin Systems)',
    software: ['StuffIt Expander', 'The Unarchiver'],
    related_extensions: ['sitx', 'zip', 'dmg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Classic SIT files may contain old Mac executables']
    },
    keywords: ['sit file', 'open sit', 'stuffit archive', 'mac sit file']
  },
  {
    slug: 'sitx',
    extension: 'SITX',
    title: '.SITX File Extension - StuffIt X Archive',
    description: 'SITX is the newer StuffIt X archive format introduced with StuffIt 7, using ATOM compression with higher ratios than the classic SIT format. It is maintained by Smith Micro and opened by StuffIt Expander.',
    category: 'Archives',
    mime: 'application/x-stuffitx',
    developer: 'Smith Micro',
    software: ['StuffIt Expander', 'The Unarchiver'],
    related_extensions: ['sit', 'zip', 'dmg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Scan extracted files from archives downloaded from the internet', 'Archives can bundle executables with misleading names']
    },
    keywords: ['sitx file', 'open sitx', 'stuffit x archive', 'extract sitx']
  },
  {
    slug: 'toast',
    extension: 'TOAST',
    title: '.TOAST File Extension - Roxio Toast Disc Image',
    description: 'TOAST is a CD and DVD disc image format created by Roxio Toast, the disc authoring program for macOS. It is similar to a standard ISO image with Toast-specific formatting, and starts with the ER signature.',
    category: 'Archives',
    mime: 'application/x-toast',
    developer: 'Roxio',
    software: ['Roxio Toast', 'Apple Disk Utility'],
    related_extensions: ['iso', 'dmg', 'img'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'Scan the image contents before opening files from it']
    },
    keywords: ['toast file', 'open toast', 'roxio toast image', 'toast disc image']
  },
  {
    slug: 'vhd',
    extension: 'VHD',
    title: '.VHD File Extension - Virtual Hard Disk Image',
    description: 'VHD is the virtual hard disk image format for Microsoft Hyper-V and Virtual PC. It stores a complete virtual drive, beginning with the conectix signature, and mounts natively in Windows Disk Management.',
    category: 'Archives',
    mime: 'application/x-vhd',
    developer: 'Microsoft Corporation',
    software: ['Microsoft Hyper-V', 'Oracle VM VirtualBox', '7-Zip'],
    related_extensions: ['iso', 'img', 'dmg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'A VHD can contain an entire bootable OS with its own malware']
    },
    keywords: ['vhd file', 'open vhd', 'virtual hard disk', 'mount vhd windows']
  },
  {
    slug: 'vmdk',
    extension: 'VMDK',
    title: '.VMDK File Extension - VMware Virtual Disk File',
    description: 'VMDK (Virtual Machine Disk) is the virtual disk format for VMware products. Sparse VMDK files begin with a # Disk DescriptorFile text header, and the format is documented in the VMware Virtual Disk Format specification.',
    category: 'Archives',
    mime: 'application/x-vmdk',
    developer: 'VMware',
    software: ['VMware Workstation', 'Oracle VM VirtualBox', 'QEMU'],
    related_extensions: ['vdi', 'iso', 'img'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'A VMDK can contain an entire guest OS with its own malware']
    },
    keywords: ['vmdk file', 'open vmdk', 'vmware virtual disk', 'mount vmdk']
  },
  {
    slug: 'vdi',
    extension: 'VDI',
    title: '.VDI File Extension - VirtualBox Virtual Disk Image',
    description: 'VDI (Virtual Disk Image) is the native virtual disk format of Oracle VM VirtualBox. The file begins with the <<< Oracle VM VirtualBox Disk Image >>> header and stores the full contents of a virtual machine drive.',
    category: 'Archives',
    mime: 'application/x-virtualbox-vdi',
    developer: 'Oracle Corporation',
    software: ['Oracle VM VirtualBox', '7-Zip'],
    related_extensions: ['vmdk', 'iso', 'img'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'A VDI can contain an entire guest OS with its own malware']
    },
    keywords: ['vdi file', 'open vdi', 'virtualbox disk image', 'convert vdi to vmdk']
  },
  {
    slug: 'qcow2',
    extension: 'QCOW2',
    title: '.QCOW2 File Extension - QEMU Copy-On-Write Disk Image',
    description: 'QCOW2 (QEMU Copy On Write version 2) is the native virtual disk format of the QEMU emulator. It supports snapshots, compression, and encryption, and begins with the QFI magic bytes.',
    category: 'Archives',
    mime: 'application/x-qemu-disk',
    developer: 'QEMU project',
    software: ['QEMU', 'Oracle VM VirtualBox'],
    related_extensions: ['vmdk', 'iso', 'img'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'A QCOW2 image can contain an entire guest OS with its own malware']
    },
    keywords: ['qcow2 file', 'open qcow2', 'qemu disk image', 'convert qcow2']
  },
  {
    slug: 'img',
    extension: 'IMG',
    title: '.IMG File Extension - Raw Disk Image File',
    description: 'IMG is a generic extension for raw, sector-by-sector disk images of floppy disks, hard drives, and USB sticks. Tools like Rufus and balenaEtcher write IMG files to removable media, and Apple Disk Utility can mount them on macOS.',
    category: 'Archives',
    mime: 'application/octet-stream',
    developer: 'Various (disc imaging tools)',
    software: ['Rufus', 'BalenaEtcher', 'Apple Disk Utility'],
    related_extensions: ['iso', 'dmg', 'mdf'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'Verify the checksum of OS installer IMG files before writing them']
    },
    keywords: ['img file', 'open img', 'disk image file', 'burn img to usb']
  },
  {
    slug: 'cue',
    extension: 'CUE',
    title: '.CUE File Extension - Cue Sheet Disc Image Descriptor',
    description: 'CUE files are plain-text cue sheets that describe the track layout of a disc image, usually paired with a BIN file. CD burning tools like ImgBurn and DAEMON Tools read the CUE sheet to reproduce the disc structure.',
    category: 'Archives',
    mime: 'application/x-cue',
    developer: 'Various (disc authoring tools)',
    software: ['DAEMON Tools Lite', 'ImgBurn', 'PowerISO Disc Manager'],
    related_extensions: ['iso', 'img', 'mdf'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['CUE files are plain text; open them in any text editor to inspect', 'The paired BIN file holds the actual disc data and should be scanned']
    },
    keywords: ['cue file', 'open cue', 'cue sheet', 'bin cue file']
  },
  {
    slug: 'nrg',
    extension: 'NRG',
    title: '.NRG File Extension - Nero Disc Image',
    description: 'NRG is the proprietary disc image format of Nero Burning ROM. It packages CD and DVD images much like ISO, and can be mounted or converted with PowerISO and 7-Zip.',
    category: 'Archives',
    mime: 'application/x-nrg',
    developer: 'Nero AG',
    software: ['Nero Burning ROM', 'PowerISO Disc Manager', '7-Zip'],
    related_extensions: ['iso', 'cue', 'mdf'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Mountable disc images can bypass email attachment security filters', 'Scan the image contents before opening files from it']
    },
    keywords: ['nrg file', 'open nrg', 'nero image file', 'convert nrg to iso']
  },
  // ---------- Fonts (Images category) ----------
  {
    slug: 'ttf',
    extension: 'TTF',
    title: '.TTF File Extension - TrueType Font File',
    description: 'TTF (TrueType Font) is the most widely used digital font format, developed by Apple and adopted by Microsoft. TrueType fonts begin with the 00 01 00 00 magic bytes and install system-wide on Windows, macOS, and Linux.',
    category: 'Images',
    mime: 'font/ttf',
    developer: 'Apple Inc. / Microsoft Corporation',
    software: ['Windows Font Viewer', 'macOS Font Book', 'FontForge'],
    related_extensions: ['otf', 'svg', 'eps'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['Install fonts only from trusted sources', 'Keep your operating system updated against font parsing exploits']
    },
    keywords: ['ttf file', 'open ttf', 'truetype font', 'install ttf font']
  },
  {
    slug: 'otf',
    extension: 'OTF',
    title: '.OTF File Extension - OpenType Font File',
    description: 'OTF (OpenType Font) is the successor to TrueType, jointly developed by Microsoft and Adobe. It begins with the OTTO magic bytes and supports advanced typography such as ligatures and alternate glyphs via the CFF outline format.',
    category: 'Images',
    mime: 'font/otf',
    developer: 'Microsoft Corporation / Adobe Inc.',
    software: ['Windows Font Viewer', 'macOS Font Book', 'FontForge'],
    related_extensions: ['ttf', 'svg', 'eps'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['Install fonts only from trusted sources', 'Keep your operating system updated against font parsing exploits']
    },
    keywords: ['otf file', 'open otf', 'opentype font', 'install otf font']
  },
  {
    slug: 'woff',
    extension: 'WOFF',
    title: '.WOFF File Extension - Web Open Font Format',
    description: 'WOFF (Web Open Font Format) is a W3C standard for delivering fonts on the web with compression and metadata. It begins with the wOFF signature and is supported by all modern browsers.',
    category: 'Images',
    mime: 'font/woff',
    developer: 'W3C (World Wide Web Consortium)',
    software: ['FontForge', 'Google Chrome', 'BirdFont'],
    related_extensions: ['woff2', 'ttf', 'svg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['WOFF is a compressed container; convert to TTF for desktop use', 'Only embed fonts you are licensed to use']
    },
    keywords: ['woff file', 'open woff', 'web font format', 'convert woff to ttf']
  },
  {
    slug: 'woff2',
    extension: 'WOFF2',
    title: '.WOFF2 File Extension - Web Open Font Format 2.0',
    description: 'WOFF2 is the second version of the W3C Web Open Font Format, using Brotli compression for files roughly 30 percent smaller than WOFF. It begins with the wOF2 signature and is the recommended web font format today.',
    category: 'Images',
    mime: 'font/woff2',
    developer: 'W3C (World Wide Web Consortium)',
    software: ['FontForge', 'Google Chrome', 'BirdFont'],
    related_extensions: ['woff', 'ttf', 'svg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['WOFF2 is a compressed container; convert to TTF for desktop use', 'Only embed fonts you are licensed to use']
    },
    keywords: ['woff2 file', 'open woff2', 'woff2 font', 'convert woff2 to ttf']
  },
  {
    slug: 'eot',
    extension: 'EOT',
    title: '.EOT File Extension - Embedded OpenType Font',
    description: 'EOT (Embedded OpenType) was Microsoft font embedding format for Internet Explorer, adding compression and DRM-style root strings to OpenType fonts. It is obsolete now that WOFF is the web standard.',
    category: 'Images',
    mime: 'application/vnd.ms-fontobject',
    developer: 'Microsoft Corporation',
    software: ['Internet Explorer', 'Microsoft Edge (Legacy)'],
    related_extensions: ['woff', 'ttf', 'svg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['EOT is obsolete; prefer WOFF2 for new web projects', 'Install fonts only from trusted sources']
    },
    keywords: ['eot file', 'open eot', 'embedded opentype', 'eot font']
  },
  {
    slug: 'pfb',
    extension: 'PFB',
    title: '.PFB File Extension - Printer Font Binary File',
    description: 'PFB (Printer Font Binary) is the binary form of the Adobe PostScript Type 1 font, storing the glyph outlines. It works together with a PFM metrics file and begins with the 80 01 marker.',
    category: 'Images',
    mime: 'application/x-font-type1',
    developer: 'Adobe Inc.',
    software: ['Adobe Acrobat', 'FontForge', 'FontLab'],
    related_extensions: ['pfm', 'ps', 'eps'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['Type 1 fonts are legacy; OpenType is the modern replacement', 'Install fonts only from trusted sources']
    },
    keywords: ['pfb file', 'open pfb', 'printer font binary', 'type 1 font']
  },
  {
    slug: 'pfm',
    extension: 'PFM',
    title: '.PFM File Extension - Printer Font Metrics File',
    description: 'PFM (Printer Font Metrics) files hold the spacing and kerning metrics for Adobe PostScript Type 1 fonts on Windows. They accompany the PFB outline file so applications can lay out text correctly.',
    category: 'Images',
    mime: 'application/x-font-type1',
    developer: 'Adobe Inc. / Microsoft Corporation',
    software: ['Microsoft Windows', 'FontForge'],
    related_extensions: ['pfb', 'ps', 'eps'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['PFM files contain only font metrics, not executable code', 'Keep both the PFB and PFM files together for the font to work']
    },
    keywords: ['pfm file', 'open pfm', 'font metrics file', 'pfb pfm font']
  },
  {
    slug: 'icns',
    extension: 'ICNS',
    title: '.ICNS File Extension - macOS Icon Resource',
    description: 'ICNS is the Apple icon image format used by macOS applications. One file holds the icon at multiple resolutions as TIFF or PNG images, beginning with the icns signature, and is created with the iconutil tool.',
    category: 'Images',
    mime: 'image/icns',
    developer: 'Apple Inc.',
    software: ['Apple Preview', 'XnViewMP', 'Inkscape'],
    related_extensions: ['ico', 'png', 'svg'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['ICNS files contain only image data', 'Use iconutil on macOS to build ICNS files from PNG icon sets']
    },
    keywords: ['icns file', 'open icns', 'mac icon file', 'convert icns to png']
  },
  {
    slug: 'jp2',
    extension: 'JP2',
    title: '.JP2 File Extension - JPEG 2000 Image',
    description: 'JP2 is the standard file extension for JPEG 2000, the wavelet-based successor to JPEG. It offers superior compression and lossless options, and begins with the 00 00 00 0C 6A 50 signature box.',
    category: 'Images',
    mime: 'image/jp2',
    developer: 'Joint Photographic Experts Group',
    software: ['Adobe Photoshop', 'GIMP', 'IrfanView', 'XnViewMP'],
    related_extensions: ['jpg', 'png', 'tiff'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['JP2 is widely used in digital cinema and archival imaging', 'Most browsers need a plugin or conversion to display JP2']
    },
    keywords: ['jp2 file', 'open jp2', 'jpeg 2000', 'convert jp2 to jpg']
  },
  {
    slug: 'jxr',
    extension: 'JXR',
    title: '.JXR File Extension - JPEG XR Image',
    description: 'JXR (JPEG XR) is an image format developed from Microsoft HD Photo with the JPEG committee, offering higher compression efficiency and wider color accuracy than JPEG. Microsoft Photos and XnViewMP open it natively.',
    category: 'Images',
    mime: 'image/jxr',
    developer: 'Microsoft Corporation / JPEG Committee',
    software: ['Microsoft Photos', 'XnViewMP', 'ImageMagick', 'Adobe Photoshop'],
    related_extensions: ['jp2', 'jpg', 'tiff'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['JXR supports lossless compression and transparency', 'Convert JXR to PNG or TIFF for maximum compatibility']
    },
    keywords: ['jxr file', 'open jxr', 'jpeg xr', 'hd photo format']
  },
  // ---------- Email & Communication ----------
  {
    slug: 'ics',
    extension: 'ICS',
    title: '.ICS File Extension - iCalendar Calendar File',
    description: 'ICS (iCalendar) is the standard plain-text format for calendar events and tasks, defined by RFC 5545. Email clients and calendar apps import ICS files to add events with dates, reminders, and attendees.',
    category: 'Email & Comm',
    mime: 'text/calendar',
    developer: 'IETF (RFC 5545) / CalConnect',
    software: ['Microsoft Outlook', 'Google Calendar', 'Apple Calendar'],
    related_extensions: ['vcf', 'csv', 'eml'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['Beware of unsolicited calendar invites with links (calendar spam)', 'ICS files are plain text; inspect them before importing']
    },
    keywords: ['ics file', 'open ics', 'icalendar file', 'import ics to outlook']
  },
  {
    slug: 'pst',
    extension: 'PST',
    title: '.PST File Extension - Outlook Personal Folders File',
    description: 'PST (Personal Storage Table) is the local data file for Microsoft Outlook, holding emails, contacts, and calendar items. It begins with the !BDN signature and can grow to tens of gigabytes.',
    category: 'Email & Comm',
    mime: 'application/vnd.ms-outlook',
    developer: 'Microsoft Corporation',
    software: ['Microsoft Outlook', 'SysTools PST Viewer'],
    related_extensions: ['ost', 'msg', 'eml'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['PST archives can contain malicious email attachments', 'Repair oversized or corrupt PST files with the Inbox Repair Tool (scanpst)']
    },
    keywords: ['pst file', 'open pst', 'outlook pst file', 'import pst']
  },
  {
    slug: 'ost',
    extension: 'OST',
    title: '.OST File Extension - Outlook Offline Data File',
    description: 'OST (Offline Storage Table) is the cached copy of a Microsoft Exchange or IMAP mailbox that lets Outlook work offline. Like PST it uses the !BDN signature, and it resynchronizes with the server when reconnected.',
    category: 'Email & Comm',
    mime: 'application/vnd.ms-outlook',
    developer: 'Microsoft Corporation',
    software: ['Microsoft Outlook', 'SysTools OST Viewer'],
    related_extensions: ['pst', 'msg', 'eml'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['OST files mirror server mailboxes and can contain malicious attachments', 'Delete the OST to force Outlook to rebuild a corrupted cache']
    },
    keywords: ['ost file', 'open ost', 'outlook ost file', 'convert ost to pst']
  },
  // ---------- Documents ----------
  {
    slug: 'chm',
    extension: 'CHM',
    title: '.CHM File Extension - Compiled HTML Help File',
    description: 'CHM (Compiled HTML Help) is Microsoft format for compressed help documentation, bundling HTML pages, images, and an index with LZX compression. Files begin with the ITSF signature and open in the HTML Help viewer; the format is now largely retired.',
    category: 'Documents',
    mime: 'application/vnd.ms-htmlhelp',
    developer: 'Microsoft Corporation',
    software: ['Microsoft HTML Help Executable', 'xCHM', 'Calibre'],
    related_extensions: ['html', 'pdf', 'epub'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['CHM files can embed scripts and ActiveX content', 'Only open CHM files from trusted software vendors']
    },
    keywords: ['chm file', 'open chm', 'compiled html help', 'chm reader']
  },
  {
    slug: 'ps',
    extension: 'PS',
    title: '.PS File Extension - PostScript Document',
    description: 'PS files contain documents in Adobe PostScript, the page description language that preceded PDF. They begin with the %!PS header and are rendered by Ghostscript, Adobe Acrobat, and many printers natively.',
    category: 'Documents',
    mime: 'application/postscript',
    developer: 'Adobe Inc.',
    software: ['Adobe Acrobat', 'Ghostscript', 'GSview'],
    related_extensions: ['eps', 'pdf', 'ai'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: true,
      tips: ['PostScript is a full programming language; avoid PS files from untrusted sources', 'Convert PS to PDF for safer everyday viewing']
    },
    keywords: ['ps file', 'open ps', 'postscript file', 'convert ps to pdf']
  },
  // ---------- Databases ----------
  {
    slug: 'dbf',
    extension: 'DBF',
    title: '.DBF File Extension - dBASE Database File',
    description: 'DBF is the database table format of dBASE, one of the earliest PC database systems, identified by a version byte such as 03 for dBASE III. Its simple header-plus-records structure made it a lasting standard for structured data exchange.',
    category: 'Databases',
    mime: 'application/x-dbase',
    developer: 'dBASE (Ashton-Tate)',
    software: ['Microsoft Excel', 'LibreOffice Base', 'DBF Viewer Plus'],
    related_extensions: ['db', 'mdb', 'csv'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['DBF files store structured data and open directly in Excel', 'Character encoding varies; check for garbled text in old DBF files']
    },
    keywords: ['dbf file', 'open dbf', 'dbase file', 'dbf viewer']
  },
  // ---------- CAD & 3D / GIS ----------
  {
    slug: 'kml',
    extension: 'KML',
    title: '.KML File Extension - Keyhole Markup Language File',
    description: 'KML (Keyhole Markup Language) is the XML-based geographic annotation format created by Keyhole and now standardized by the OGC. Google Earth reads KML to display placemarks, paths, and 3D overlays on the globe.',
    category: 'CAD & 3D',
    mime: 'application/vnd.google-earth.kml+xml',
    developer: 'Google / Open Geospatial Consortium',
    software: ['Google Earth', 'QGIS', 'ArcGIS Pro'],
    related_extensions: ['gpx', 'xml', 'csv'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['KML is XML text; inspect it in any editor', 'KMZ is the zipped version of the same format']
    },
    keywords: ['kml file', 'open kml', 'google earth kml', 'kml map']
  },
  {
    slug: 'gpx',
    extension: 'GPX',
    title: '.GPX File Extension - GPS Exchange Format File',
    description: 'GPX (GPS Exchange Format) is the XML standard for sharing GPS tracks, routes, and waypoints between devices and apps. It was created by TopoGrafix and is the common currency of hiking, cycling, and fitness trackers.',
    category: 'CAD & 3D',
    mime: 'application/gpx+xml',
    developer: 'TopoGrafix',
    software: ['QGIS', 'Garmin BaseCamp', 'Google Earth'],
    related_extensions: ['kml', 'xml', 'csv'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['GPX is XML text; inspect it in any editor', 'Shared GPX tracks can reveal home locations; review before publishing']
    },
    keywords: ['gpx file', 'open gpx', 'gps track file', 'gpx viewer']
  },
  {
    slug: 'x3d',
    extension: 'X3D',
    title: '.X3D File Extension - Extensible 3D Graphics File',
    description: 'X3D (Extensible 3D) is the ISO-standard XML successor to VRML for interactive 3D graphics on the web. Blender, MeshLab, and FreeWRL can open X3D scenes containing meshes, materials, and animations.',
    category: 'CAD & 3D',
    mime: 'model/x3d+xml',
    developer: 'Web3D Consortium',
    software: ['Blender', 'MeshLab', 'FreeWRL'],
    related_extensions: ['obj', 'stl', 'dae'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['X3D is XML text; inspect scene contents in any editor', 'X3D supports scripting nodes; prefer files from trusted sources']
    },
    keywords: ['x3d file', 'open x3d', 'extensible 3d', 'x3d viewer']
  },
  // ---------- Audio & Video ----------
  {
    slug: 'srt',
    extension: 'SRT',
    title: '.SRT File Extension - SubRip Subtitle File',
    description: 'SRT (SubRip Text) is the most common plain-text subtitle format, pairing numbered captions with start and end timestamps. Every major media player reads SRT, and it is trivial to edit by hand.',
    category: 'Audio & Video',
    mime: 'application/x-subrip',
    developer: 'SubRip (Brain)',
    software: ['VLC Media Player', 'Aegisub', 'Notepad'],
    related_extensions: ['ass', 'sub', 'txt'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['SRT files are plain text and cannot execute code', 'Match the subtitle encoding (UTF-8) to avoid garbled characters']
    },
    keywords: ['srt file', 'open srt', 'subrip subtitle', 'srt player']
  },
  {
    slug: 'sub',
    extension: 'SUB',
    title: '.SUB File Extension - MicroDVD Subtitle File',
    description: 'SUB files in the MicroDVD format store subtitles as plain text with frame-based timing, usually paired with an IDX index file. VLC and Subtitle Edit can load and convert them to the more common SRT format.',
    category: 'Audio & Video',
    mime: 'text/x-microdvd',
    developer: 'MicroDVD',
    software: ['VLC Media Player', 'Subtitle Edit'],
    related_extensions: ['srt', 'ass', 'txt'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['SUB is ambiguous; some SUB files are DivX bitmap subtitles needing the IDX pair', 'Convert SUB to SRT for the widest player support']
    },
    keywords: ['sub file', 'open sub', 'microdvd subtitle', 'sub idx subtitles']
  },
  {
    slug: 'ass',
    extension: 'ASS',
    title: '.ASS File Extension - Advanced SubStation Alpha Subtitle',
    description: 'ASS (Advanced SubStation Alpha) is the styled subtitle format of the fansubbing era, supporting positioning, fonts, colors, and karaoke effects. Aegisub edits it and VLC renders it with full styling.',
    category: 'Audio & Video',
    mime: 'text/x-ass',
    developer: 'VSFilter / DirectVobSub project',
    software: ['VLC Media Player', 'Aegisub'],
    related_extensions: ['srt', 'sub', 'txt'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['ASS files are plain text; styling is display-only', 'Embedded fonts in MKV containers come from the video file, not the ASS itself']
    },
    keywords: ['ass file', 'open ass', 'ssa subtitle', 'ass subtitle player']
  },
  {
    slug: 'mpg',
    extension: 'MPG',
    title: '.MPG File Extension - MPEG Video File',
    description: 'MPG files hold video in the MPEG-1 or MPEG-2 program stream format, beginning with the 00 00 01 BA packet header. The format powered Video CD and early digital TV, and plays in virtually every media player.',
    category: 'Audio & Video',
    mime: 'video/mpeg',
    developer: 'Moving Picture Experts Group',
    software: ['VLC Media Player', 'Windows Media Player'],
    related_extensions: ['mpeg', 'mp4', 'avi'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['MPG is a mature, widely supported container', 'Convert legacy MPG files to MP4 for smaller files and broader device support']
    },
    keywords: ['mpg file', 'open mpg', 'mpeg video', 'play mpg']
  },
  {
    slug: 'm4b',
    extension: 'M4B',
    title: '.M4B File Extension - MPEG-4 Audiobook File',
    description: 'M4B is the MPEG-4 audiobook format used by Apple Books and iTunes, with AAC audio plus chapter markers and bookmarking. Unprotected M4B files play in VLC and Windows Media Player; store-bought ones may carry FairPlay DRM.',
    category: 'Audio & Video',
    mime: 'audio/mp4',
    developer: 'Apple Inc.',
    software: ['Apple Books', 'VLC Media Player', 'Windows Media Player'],
    related_extensions: ['m4a', 'mp3', 'aac'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['DRM-protected M4B files only play in software linked to the purchasing account', 'VLC can convert unprotected M4B files to MP3']
    },
    keywords: ['m4b file', 'open m4b', 'audiobook file', 'm4b player']
  },
  {
    slug: 'swf',
    extension: 'SWF',
    title: '.SWF File Extension - Shockwave Flash Movie',
    description: 'SWF (Small Web Format) is the compiled Flash animation format that powered web games and interactive content in the 2000s. Files begin with FWS or CWS magic bytes; Adobe discontinued Flash on December 31, 2020, and the open-source Ruffle emulator now plays SWF content.',
    category: 'Audio & Video',
    mime: 'application/x-shockwave-flash',
    developer: 'Adobe Inc. (originally Macromedia)',
    software: ['Ruffle', 'VLC Media Player', 'GOM Player'],
    related_extensions: ['fla', 'flv', 'mp4'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: true,
      tips: ['Flash reached end of life on December 31, 2020; uninstall Flash Player', 'SWF files contain compiled ActionScript; open only from trusted sources']
    },
    keywords: ['swf file', 'open swf', 'flash file', 'play swf 2024']
  },
  {
    slug: 'ogv',
    extension: 'OGV',
    title: '.OGV File Extension - Ogg Video File',
    description: 'OGV is the video profile of the open-source Ogg container from the Xiph.Org Foundation, typically carrying Theora video and Vorbis audio. Files begin with the OggS signature and play in VLC, MPlayer, and modern browsers.',
    category: 'Audio & Video',
    mime: 'video/ogg',
    developer: 'Xiph.Org Foundation',
    software: ['VLC Media Player', 'MPlayer', 'Elmedia Player'],
    related_extensions: ['ogg', 'webm', 'mp4'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['OGV is a patent-free open format popular for web video', 'Convert OGV to MP4 or WebM for maximum device compatibility']
    },
    keywords: ['ogv file', 'open ogv', 'ogg video', 'play ogv']
  },
  {
    slug: 'amr',
    extension: 'AMR',
    title: '.AMR File Extension - Adaptive Multi-Rate Audio File',
    description: 'AMR (Adaptive Multi-Rate) is the speech codec format standardized by 3GPP for GSM voice recordings. Files begin with the #!AMR header and are the classic format of phone voice memos.',
    category: 'Audio & Video',
    mime: 'audio/amr',
    developer: '3GPP / Ericsson',
    software: ['VLC Media Player', 'QuickTime Player', 'Audacity'],
    related_extensions: ['mp3', 'wav', 'm4a'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['AMR is optimized for speech, not music', 'Convert AMR to MP3 or WAV for editing and sharing']
    },
    keywords: ['amr file', 'open amr', 'amr audio', 'convert amr to mp3']
  },
  {
    slug: 'rm',
    extension: 'RM',
    title: '.RM File Extension - RealMedia File',
    description: 'RM (RealMedia) is the streaming media container from RealNetworks that dominated internet video in the late 1990s. Files begin with the .RMF signature and still play in VLC and MPlayer.',
    category: 'Audio & Video',
    mime: 'application/vnd.rn-realmedia',
    developer: 'RealNetworks',
    software: ['VLC Media Player', 'RealPlayer', 'MPlayer'],
    related_extensions: ['mp4', 'avi', 'wmv'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['RealMedia is a legacy format; modern players handle it via FFmpeg', 'Convert RM files to MP4 for reliable playback on current devices']
    },
    keywords: ['rm file', 'open rm', 'realmedia file', 'realplayer file']
  },
  {
    slug: 'qt',
    extension: 'QT',
    title: '.QT File Extension - QuickTime Movie File',
    description: 'QT is an early extension for Apple QuickTime movies, functionally the same container as MOV. QuickTime Player and VLC open QT files, which wrap video and audio in the QuickTime file format.',
    category: 'Audio & Video',
    mime: 'video/quicktime',
    developer: 'Apple Inc.',
    software: ['QuickTime Player', 'VLC Media Player'],
    related_extensions: ['mov', 'mp4', 'avi'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['QT and MOV are the same QuickTime container', 'Convert QT to MP4 for playback on non-Apple devices']
    },
    keywords: ['qt file', 'open qt', 'quicktime file', 'qt video']
  },
];
