// Batch: 1 troubleshooting guide (2026-10-13). Imported and spread into
// TROUBLESHOOTING_GUIDES in troubleshootingData.ts (keeps the database diff small).
import type { TroubleshootingGuideItem } from './troubleshootingData';

export const TROUBLESHOOTING_BATCH_OCT2026: TroubleshootingGuideItem[] = [
{
  id: 'file-too-large-for-destination-file-system',
  title: 'File Too Large for the Destination File System: Fixed',
  subtitle:
    'File too large for the destination file system? The FAT32 4GB limit. Fix it: reformat to exFAT/NTFS, convert without losing data, or split the file.',
  category: 'Universal',
  problemSummary:
    'You are copying a file to a USB drive with plenty of free space — a 5GB video onto a 16GB stick — and Windows stops you: “the file is too large for the destination file system.” The drive clearly has room, so the message is confusing. The catch: it is not about free space. The most common cause is that the drive is formatted as FAT32, which cannot hold any single file larger than 4GB no matter how empty it is. This guide starts there, shows you how to confirm it in seconds, then walks every fix in order of least destructive first: converting without losing data, reformatting properly, splitting the file, and the edge cases the quick-fix listicles miss.',
  commonErrorMessages: [
    'The file is too large for the destination file system.',
    'The file is too large for the target file system.',
    'File Too Large',
    'The file <name> is too large for the destination file system',
  ],
  symptoms: [
    'Copying a single file larger than 4GB to a USB drive or SD card fails immediately, even though the drive shows plenty of free space',
    'The error appears the instant the copy starts — not partway through, which rules out a failing drive or a bad cable',
    'Smaller files copy to the same drive without any problem',
    'The same file copies fine to your computer\'s internal drive but not to the removable drive',
    'The drive in question is one that came pre-formatted: most USB sticks and SD cards ship as FAT32 from the factory',
    'You are preparing a bootable Windows USB and the install.wim file (often over 4GB) triggers the error',
  ],
  diagnosticFlow: {
    problemStatement:
      'A file copy to a removable drive fails immediately with "the file is too large for the destination file system," despite the drive having more than enough free space for the file.',
    analysisTechnique:
      'Separate "no room" from "wrong file system" first, because they demand opposite fixes. Check two numbers: the size of the single file you are copying, and the file system of the destination drive (right-click the drive in File Explorer > Properties, and read the "File system" line — or run `fsutil fsinfo volumeinfo X:` in Command Prompt, replacing X with the drive letter). If the file is over 4GB and the drive is FAT32, you have found it: FAT32 cannot store any individual file larger than 4GB, full stop, regardless of total free space. That combination accounts for the overwhelming majority of reports. If the drive is already NTFS or exFAT, or the file is under 4GB, you are in edge-case territory — verify actual free space (a nearly-full drive fails differently, but users misread it), rule out counterfeit drives that lie about their capacity, and check whether Windows ransomware protection is producing a misleading message.',
    identifiedRootCause:
      'In the typical case, a FAT32-formatted removable drive meeting a file larger than 4GB. FAT32 is the factory default for USB sticks and SD cards because every operating system reads it, but its design dates to an era when a 4GB single file was unimaginable — so the format hard-caps individual files at 4GB (technically 4GB minus one byte). Total drive capacity is irrelevant: a 128GB FAT32 drive still rejects a 4.1GB file. The remaining cases split between drives that are not really as big as they claim (counterfeit flash drives with hacked capacity reports), Windows Controlled Folder Access blocking the copy with a confusing message, and simple free-space misreads where the file plus existing contents genuinely exceed capacity.',
    recommendedResolution:
      'Match the fix to the diagnosis. For the standard FAT32 case, the cleanest fix is converting the drive to NTFS without losing data: open an elevated Command Prompt and run `convert X: /fs:ntfs` (replace X with the drive letter) — this preserves everything on the drive. If the drive is empty or backed up, reformatting to exFAT is often the better choice for a removable drive, since exFAT has no 4GB limit and works across Windows and macOS (NTFS is Windows-centric for writing). If you cannot touch the drive\'s format — a camera SD card, a car stereo USB, a device that requires FAT32 — split the file into sub-4GB parts with 7-Zip instead. And if the drive is already NTFS/exFAT, work the edge cases: confirm real free space, test for a counterfeit drive, and check ransomware protection settings.',
  },
  whyItHappens: [
    {
      cause: 'FAT32 4GB per-file limit (the cause ~95% of the time)',
      explanation:
        'FAT32 stores file sizes in a 32-bit field, which maxes out at 4,294,967,295 bytes — 4GB minus one byte. Any single file larger than that simply cannot exist on a FAT32 volume, and Windows tells you so the moment the copy starts. This bites hardest with USB flash drives and SD cards because manufacturers format them FAT32 at the factory: it is the one file system that Windows, macOS, Linux, cameras, TVs, and car stereos all read without extra software. So the most compatible drive you own is also the one with the strictest single-file limit. The classic triggers are video files (a 4K home movie crosses 4GB fast), disk images (Windows install.wim files routinely exceed 4GB), and large backups. Note the important subtlety: the limit is per file, not per drive. Ten 3GB files (30GB total) copy to a FAT32 drive fine; one 4.1GB file does not, even on an empty 128GB drive.',
    },
    {
      cause: 'The device genuinely requires FAT32',
      explanation:
        'Some hardware will not accept anything but FAT32 — older car stereos, many dashcams, some cameras, game consoles, and embedded devices. Reformatting those drives to NTFS or exFAT "fixes" the copy error and breaks the device: it simply will not see the drive anymore. If the drive lives in such a device, do not reformat. The correct fixes are the non-destructive ones: split the file into sub-4GB volumes with 7-Zip (the device never needs to know), or use a second drive formatted appropriately for the transfer and keep the FAT32 drive as the device expects it. Always check the device manual before reformatting any drive that did not come from a computer store shelf.',
    },
    {
      cause: 'Counterfeit drive lying about its capacity',
      explanation:
        'A depressingly common trap with cheap high-capacity USB drives and SD cards: the drive reports 128GB or 256GB to Windows but physically contains far less flash memory — sometimes as little as 8GB. Everything works until you exceed the real capacity, at which point writes fail with confusing errors, occasionally including the "too large" message. If your drive is a no-name bargain and the math does not add up (a "256GB" drive choking on a 5GB file), suspect this. Test tools exist that write patterns across the full advertised capacity and verify them; a genuine drive passes, a fake one fails at its real size. There is no software fix for fake flash — the only remedy is a refund and a drive from a reputable brand.',
    },
    {
      cause: 'Windows Controlled Folder Access producing a misleading error',
      explanation:
        'Windows Security includes ransomware protection called Controlled Folder Access, which blocks unauthorized programs from writing to protected folders — and occasionally to removable drives. When it blocks a copy, the error surfaced can misleadingly read as a file-size problem rather than a permission problem. Suspect this when the drive is already NTFS or exFAT (so the FAT32 explanation cannot apply) and the file is well under any limit. Check it via Windows Security > Virus & threat protection > Ransomware protection: if Controlled Folder Access is on, temporarily toggle it off and retry the copy. If the copy succeeds, do not leave protection off — instead, add your file manager or copy tool to the allowed-apps list and re-enable it.',
    },
    {
      cause: 'Simple free-space misread',
      explanation:
        'Sometimes the boring answer is the right one: the file plus what is already on the drive genuinely exceeds capacity, or the "free space" reading is stale. This typically shows up as the copy failing partway through rather than instantly — an instant failure at 0% is the FAT32 signature; a failure at 90% is a space problem. Also watch for the Recycle Bin: deleted files on removable drives can sit in a hidden trash folder still consuming space. Empty it (or hold Shift while deleting) and recheck. And remember that drive manufacturers count gigabytes decimally while Windows counts in binary — a "16GB" drive shows about 14.9GB in Windows before you put a single file on it.',
    },
  ],
  howToConfirm: [
    {
      method: 'Check the drive\'s file system (10 seconds)',
      steps: [
        'Plug in the drive and open File Explorer (Windows key + E).',
        'In "This PC," right-click the drive and choose Properties.',
        'Read the "File system" line. If it says FAT32 and your file is over 4GB, case closed — that is the entire problem.',
        'For the command-line inclined: open Command Prompt and run `fsutil fsinfo volumeinfo X:` (replace X with the drive letter) — it reports the file system directly.',
      ],
      whatToLookFor:
        'FAT32 + file over 4GB = the classic case, proceed to the convert/reformat fixes. NTFS or exFAT = the file system is not the problem; work the edge cases below.',
    },
    {
      method: 'Compare the file size against the 4GB line',
      steps: [
        'Right-click the file you are copying and check its exact size.',
        'If it is over 4GB (4,294,967,295 bytes) and the destination is FAT32, no settings tweak or retry will ever make it fit — the limit is structural.',
        'If it is under 4GB and still failing on FAT32, the file system is innocent; check free space and the other causes.',
      ],
      whatToLookFor:
        'Over 4GB on FAT32 is a hard no. Under 4GB failing means look elsewhere — space, counterfeit drive, or protection software.',
    },
    {
      method: 'Rule out the impostors',
      steps: [
        'Check real free space: drive Properties shows used vs. free — make sure the file genuinely fits with margin to spare.',
        'If the drive is a suspiciously cheap high-capacity stick, consider a capacity test before trusting it with important data.',
        'If the drive is already NTFS/exFAT and space is fine, open Windows Security > Ransomware protection and see whether Controlled Folder Access is enabled.',
      ],
      whatToLookFor:
        'A drive that fails the capacity test is counterfeit — replace it. A copy that succeeds with protection toggled off points at Controlled Folder Access, not the file system.',
    },
  ],
  osWorkflows: [
    {
      os: 'windows',
      title: 'Windows: convert to NTFS without losing data (best first fix)',
      instructions: [
        'Confirm the diagnosis first: the drive is FAT32 and the file exceeds 4GB.',
        'Back up anything irreplaceable anyway — the convert process is designed to preserve data, but a backup is cheap insurance against power loss mid-operation.',
        'Open Command Prompt as Administrator: press the Windows key, type "cmd," right-click Command Prompt, and choose "Run as administrator."',
        'Type `convert X: /fs:ntfs` (replace X with your drive\'s letter — get it right; converting the wrong drive is still safe, but converting nothing wastes your time) and press Enter.',
        'Wait for the process to finish. It typically takes under a minute for flash drives. Your files remain exactly where they were.',
        'Retry the copy. The 4GB limit is gone — NTFS supports individual files up to 16TB.',
        'If you would rather start clean (or the drive is empty), reformatting is simpler: right-click the drive in File Explorer > Format, choose NTFS or exFAT from the File system dropdown, tick Quick Format, and click Start. Reformatting erases everything, so only do this with a backup or an empty drive.',
      ],
      tips:
        'Choosing between NTFS and exFAT for a USB stick: exFAT has no 4GB limit either and both Windows and macOS read and write it natively, making it the better pick for drives that move between systems. NTFS is the better pick for Windows-only drives (it also supports permissions and journaling). The old `convert` command only converts to NTFS; for exFAT you must reformat.',
    },
    {
      os: 'mac',
      title: 'macOS: reformat the drive to exFAT with Disk Utility',
      instructions: [
        'macOS can read NTFS but not write to it reliably without third-party drivers, so exFAT is the right target for a Mac-touched removable drive: no 4GB limit, full read/write on both macOS and Windows.',
        'Copy everything off the drive first — reformatting erases it completely.',
        'Open Disk Utility (Applications > Utilities > Disk Utility).',
        'Select the drive (the physical device, not just the volume) in the left sidebar and click Erase.',
        'Choose exFAT as the format and GUID Partition Map as the scheme, then click Erase.',
        'Once done, the drive accepts files of any size on both Mac and Windows.',
        'If the drive must stay FAT32 for a camera or other device, do not reformat — use the split-file method below instead.',
      ],
      tips:
        'Never reformat a drive that lives in a camera, dashcam, or car stereo without checking the manual — many such devices only recognize FAT32, and an exFAT drive will simply not appear.',
    },
    {
      os: 'all',
      title: 'All platforms: split the file or sidestep the drive',
      instructions: [
        'When reformatting is off the table (a device-mandated FAT32 drive, or a drive you cannot erase right now), split the file into sub-4GB pieces with 7-Zip, which is free.',
        'Right-click the large file, choose 7-Zip > "Add to archive."',
        'In the "Split to volumes, bytes" field, type 3900M — that is 3,900 megabytes, safely under FAT32\'s 4GB ceiling with margin.',
        'Click OK. 7-Zip produces numbered parts (filename.7z.001, .002, and so on).',
        'Copy all the parts to the FAT32 drive — each one is individually under the limit, so they all transfer fine.',
        'To reassemble on the destination, right-click the .001 part and choose 7-Zip > "Extract here." All parts must be present in the same folder.',
        'Alternative that avoids touching the drive at all: upload the file to cloud storage (OneDrive, Google Drive, Dropbox all accept multi-gigabyte files) and download it on the destination machine — the file system limit never comes into play.',
      ],
      tips:
        'Splitting is also the answer when the receiving end cannot be changed — mailing a drive to someone, or a shared computer where you lack admin rights to reformat. The parts are useless individually, so keep them together.',
    },
  ],
  measurableSecurityNotes: {
    verifiedAspects: [
      'The drive\'s reported file system (via Properties or fsutil) is authoritative — FAT32 plus a >4GB file is a deterministic failure, not a guess.',
      'File-size comparison against the 4,294,967,295-byte FAT32 ceiling confirms the diagnosis before any destructive action.',
      'A capacity test distinguishes genuine drives from counterfeits before trusting them with important data.',
    ],
    antivirusDistinction:
      'These are storage-configuration checks, not malware scans — they verify file systems, sizes, and capacities. Reformatting erases the entire drive, so back up first; the `convert` command preserves data but a backup is still wise. Neither operation detects or removes malware: scan drives from untrusted sources with current antivirus software regardless of file system.',
  },
  connectedTools: [],
  relatedExtensions: ['iso', 'wim'],
  relatedGuideIds: [
    'why-wont-my-file-open',
  ],
  faqs: [
    {
      question: 'Will reformatting my USB drive delete everything on it?',
      answer:
        'Yes — reformatting erases the entire drive, which is why the guide leads with the convert command instead. Running `convert X: /fs:ntfs` from an elevated Command Prompt changes FAT32 to NTFS while leaving your files untouched. Only reformat when the drive is empty, fully backed up, or when you specifically want exFAT (which requires a reformat — convert only produces NTFS).',
    },
    {
      question: 'Should I choose exFAT or NTFS for my flash drive?',
      answer:
        'For a drive that moves between Windows and Mac, exFAT: no 4GB limit and both systems read and write it natively. For a Windows-only drive, NTFS: same freedom from the limit plus journaling and file permissions. For a drive that lives in a camera, car stereo, or game console, check the manual first — many such devices only accept FAT32, in which case neither is an option and you should split files instead.',
    },
    {
      question: 'Why does my 64GB drive still give this error on a 5GB file?',
      answer:
        'Because the limit is per file, not per drive. FAT32 cannot store any individual file over 4GB (technically 4GB minus one byte), even on a terabyte drive with nothing else on it. The drive\'s total capacity is irrelevant to this error — only the file system and the single file\'s size matter.',
    },
    {
      question: 'My drive is already NTFS and I still get the error. Now what?',
      answer:
        'Then the file system is innocent — work the edge cases. First, verify with `fsutil fsinfo volumeinfo X:` that it really is NTFS and not a mislabeled FAT32. Second, check actual free space; a nearly-full drive fails differently but users conflate the messages. Third, check Windows Security > Ransomware protection: Controlled Folder Access can block copies with a misleading "too large" message — toggle it off to test, then allow-list your app instead of leaving it off. Fourth, suspect a counterfeit drive if it was a bargain-bin high-capacity stick.',
    },
    {
      question: 'Can I just compress the file with ZIP to get under 4GB?',
      answer:
        'Sometimes, but do not count on it. Compression only helps if the file\'s contents are compressible — documents and raw video often shrink a lot, but an already-compressed MP4 or ZIP barely shrinks at all. And even when it works, you are gambling on the exact byte count landing under 4,294,967,295. Splitting with 7-Zip at 3900M volumes is deterministic where compression is a coin flip — use splitting when it has to work the first time.',
    },
  ],
},
];
