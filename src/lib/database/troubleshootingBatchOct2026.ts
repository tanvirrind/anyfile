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
},,
{
  id: 'powerpoint-wont-open',
  title: "PowerPoint Presentation Won't Open? Diagnose and Fix It",
  subtitle:
    "PowerPoint won't open your presentation? Diagnose it first: blocked file, Protected View, corruption, or wrong app — then apply the matching fix, including Open and Repair.",
  category: 'Documents',
  problemSummary:
    'You double-click a presentation and PowerPoint refuses: an error about "a problem with content," a red Protected View banner, a file that opens as gibberish, or nothing happening at all. The instinct is to assume the file is corrupted — but corruption is only one of four common causes, and each demands a different fix. A file blocked by Windows security needs unblocking, not repair; a file in Protected View needs one click, not surgery; a file opened in the wrong program needs the right app, not recovery software. This guide diagnoses first: a two-minute ladder that identifies which of the four situations you are in, then walks the matching fix — including Microsoft\'s own Open and Repair, and a clever PPTX-is-a-ZIP check that tells you in seconds whether the file\'s container is intact.',
  commonErrorMessages: [
    'PowerPoint found a problem with content in <filename>. PowerPoint can attempt to repair the presentation.',
    "Sorry, PowerPoint can't read <filename>.",
    'PowerPoint can\'t open the file.',
    'Protected View: Be careful — files from the Internet can contain viruses.',
    'The file is corrupt and cannot be opened.',
  ],
  symptoms: [
    'Double-clicking the .pptx shows an error offering to "repair" the presentation',
    'The file opens but shows a red or yellow Protected View banner instead of editable slides',
    'PowerPoint opens with a blank gray window and no slides load',
    'The presentation opens on one computer but not another',
    'A downloaded presentation will not open while ones you made yourself open fine',
    'The file opens in a different program (or as a ZIP archive) instead of PowerPoint',
  ],
  diagnosticFlow: {
    problemStatement:
      'A PowerPoint presentation (.pptx or .ppt) fails to open normally: an error dialog, a Protected View banner that will not clear, a blank window, or the file opening in the wrong application.',
    analysisTechnique:
      'Work the four causes in order of likelihood for downloaded files: blocked-by-Windows first, Protected View second, genuine corruption third, wrong program fourth. Check the file\'s origin first — right-click the file, choose Properties, and look at the bottom of the General tab. If you see a Security note saying "This file came from another computer and might be blocked," with an "Unblock" checkbox, you have found it: Windows attached Mark-of-the-Web to the download and Office is refusing to fully trust it. No unblock note? Open PowerPoint and try File > Open > Browse — if the file opens with a Protected View banner, that is cause two, cleared with one click. If instead you get a "problem with content" error offering repair, you are in corruption territory (cause three) — and before reaching for recovery tools, run the PPTX-is-a-ZIP test below: copy the file, rename the copy\'s extension from .pptx to .zip, and try opening it. If the ZIP opens and shows folders like _rels, docProps, and ppt, the container is structurally intact and the damage is limited to internal XML — highly repairable. If the renamed ZIP will not open either, the file is truncated or was never a PPTX at all. Finally, if the file "opens" as gibberish text or launches another program, check what is actually opening it: right-click > Open with, and confirm the extension is really .pptx and not something like .pptx.exe hiding behind Windows\' hidden-extension default.',
    identifiedRootCause:
      'One of four distinct situations. (1) Mark-of-the-Web block: Windows flags internet downloads and Office treats them as untrusted — the file is almost certainly fine, it is just distrusted. (2) Protected View: Office opens internet files in a sandboxed read-only mode as a precaution; the file may be perfectly healthy. (3) Genuine corruption: interrupted downloads, failing drives, crashed saves, or email-attachment mangling damage the file\'s internal structure — the only case where repair is actually needed. (4) Wrong program or mislabeled file: the file opens in the wrong app, or is not a presentation at all (a renamed file, a download that failed partway and contains an HTML error page). Each cause has its own fix, and applying the wrong one wastes your time — unblocking cannot fix corruption, and repair cannot fix a block.',
    recommendedResolution:
      'Match the fix to the diagnosis. Blocked file: right-click > Properties > check "Unblock" > OK, then reopen. Protected View: click "Enable Editing" in the banner (only for files from senders you trust). Corruption: use Microsoft\'s built-in Open and Repair (File > Open > Browse > select the file > click the dropdown arrow on the Open button > "Open and Repair") before trying anything third-party — and use the PPTX-is-a-ZIP test first to see whether repair is even plausible. Wrong program: right-click > Open with > PowerPoint, and if the file is mislabeled, verify its real type with a magic-byte check before renaming anything.',
  },
  whyItHappens: [
    {
      cause: 'Windows blocked the file (Mark of the Web) — the #1 cause for downloads',
      explanation:
        'When Windows downloads a file from the internet — email attachment, browser download, chat app — it attaches an invisible tag called Mark of the Web (a Zone.Identifier alternate data stream recording ZoneId=3, the internet zone). Microsoft Office reads that tag and treats the file as untrusted: depending on version and policy, it either refuses to open it with a "blocked file" message or opens it in Protected View. The file itself is usually perfectly fine; the operating system is simply refusing to vouch for something that arrived from outside. This is why the symptom pattern is so distinctive: files you created open fine, files someone sent you do not. The fix is equally distinctive — unblocking the file (right-click > Properties > Unblock) removes the tag permanently, and the file behaves like a local one from then on. Note that some organizations enforce blocking via policy, in which case the Unblock checkbox may be absent and IT owns the decision.',
    },
    {
      cause: 'Protected View sandboxing',
      explanation:
        'Protected View is Office\'s middle ground between blocking a file outright and trusting it: the presentation opens in a sandboxed, read-only mode with a banner explaining the file came from a potentially unsafe location (internet, email attachment, or an unsafe location on your network). Editing, macros, and active content are disabled until you click "Enable Editing." For files from trusted senders this is a one-click non-issue; for unexpected files it is a genuine safety feature doing its job. Confusion arises because users mistake the banner for an error — it is not an error, it is a precaution, and the presentation content is usually fully visible behind it. Only click through for files you were expecting from senders you trust; for anything else, the banner is telling you something worth hearing.',
    },
    {
      cause: 'Genuine file corruption',
      explanation:
        'Sometimes the file really is damaged. The usual suspects: a download that was interrupted (the file is shorter than it should be), an email attachment mangled by an overzealous gateway, a save interrupted by a crash or power loss, or storage media starting to fail. A modern .pptx is a ZIP archive full of XML parts, and corruption can strike at two levels: the ZIP container itself (truncation, bad headers — the file will not open as a ZIP either) or individual XML parts inside it (one damaged slide\'s XML while the rest is fine). The PPTX-is-a-ZIP test distinguishes these in seconds and tells you whether Microsoft\'s Open and Repair has something to work with. Container intact but PowerPoint complaining usually means damaged XML inside — the most repairable scenario. Container broken means the file is truncated or was never a presentation, and no repair tool can conjure the missing bytes.',
    },
    {
      cause: 'Wrong program, wrong extension, or wrong file entirely',
      explanation:
        'Not every "won\'t open" is a PowerPoint problem. If .pptx files have been associated with another program (an archive manager, a different office suite, a viewer that cannot handle the format), double-clicking launches the wrong app and the failure looks like file damage. Right-click > Open with > PowerPoint reasserts the association. Deeper: the file may not be a presentation at all. A download that failed partway often contains an HTML error page saved with a .pptx name; a file emailed through a mangling gateway may have been renamed; and with Windows hiding extensions by default, "presentation.pptx.exe" displays as "presentation.pptx" while being an executable. When the file behaves nothing like a presentation — opens as text gibberish, triggers a download prompt, or has a suspicious size (a few kilobytes for a "50-slide deck") — verify the real type with a magic-byte check before doing anything else.',
    },
    {
      cause: 'Outdated PowerPoint or disabled add-ins (the rare cases)',
      explanation:
        'Two less common but real causes. First, very old PowerPoint versions can choke on newer files: the .pptx format has evolved (newer transitions, media embeddings, morph), and a PowerPoint from a decade ago may fail on a file made today — updating Office, or opening the file in the free PowerPoint web app as a test, resolves it. Second, misbehaving COM add-ins occasionally intercept the open process and break it; starting PowerPoint in safe mode (hold Ctrl while launching, or run `powerpnt /safe`) bypasses add-ins, and if the file opens in safe mode, an add-in is the culprit — disable them one by one under File > Options > Add-ins. Also worth knowing: PowerPoint historically consults the default printer during open, and a broken printer driver has been known to hang the launch — an odd one, but documented.',
    },
  ],
  howToConfirm: [
    {
      method: 'Check for the Windows block (30 seconds)',
      steps: [
        'Right-click the presentation file and choose Properties.',
        'On the General tab, scroll to the bottom and look for a Security section.',
        'If it says "This file came from another computer and might be blocked to help protect this computer" with an "Unblock" checkbox — that is your cause.',
        'Check "Unblock," click OK, and reopen the file. If it now opens normally, diagnosis confirmed.',
      ],
      whatToLookFor:
        'The Unblock checkbox is the smoking gun for downloaded files. No Security section at all means the file is not blocked — move to the next check.',
    },
    {
      method: 'The PPTX-is-a-ZIP container test (1 minute)',
      steps: [
        'Make a COPY of the presentation (never experiment on the original).',
        'Rename the copy\'s extension from .pptx to .zip — confirm the change if Windows warns you.',
        'Double-click the renamed file. If it opens as an archive showing folders like _rels, docProps, and ppt, the ZIP container is intact.',
        'For extra rigor, check the file\'s first bytes with a magic-byte tool: a genuine PPTX starts with the ZIP signature 50 4B 03 04.',
        'If the ZIP opens: the damage (if any) is inside the XML parts — Microsoft\'s Open and Repair is worth trying. If the ZIP will not open: the file is truncated or mislabeled; repair tools cannot help.',
      ],
      whatToLookFor:
        'An openable ZIP means structural hope; a non-opening ZIP means the bytes themselves are wrong. This single test separates "repairable" from "hopeless" before you spend any money or time.',
    },
    {
      method: 'Isolate program vs file (2 minutes)',
      steps: [
        'Try opening a different, known-good presentation. If it also fails, PowerPoint itself (or an add-in) is the problem, not your file.',
        'Try opening the problem file in PowerPoint\'s safe mode: close PowerPoint, hold Ctrl while launching it (or run `powerpnt /safe`), then open the file from inside.',
        'Try the free PowerPoint web app (office.com) or Google Slides with the file — if it opens there, your desktop install or its add-ins are at fault.',
        'If the file fails everywhere including the web app, the file is the problem — proceed to repair.',
      ],
      whatToLookFor:
        'Failure isolated to one machine or one install points at the program; failure everywhere points at the file. Never pay for repair software before this isolation is done.',
    },
  ],
  osWorkflows: [
    {
      os: 'windows',
      title: 'Windows: unblock, clear Protected View, then Open and Repair',
      instructions: [
        'First, rule out the block: right-click the file > Properties > check "Unblock" if present > OK. Reopen — many cases end here.',
        'If the file opens with a Protected View banner, click "Enable Editing" (only for expected files from trusted senders). To stop the banner for a trusted location instead of per-file, move the file to a folder you designate as trusted via File > Options > Trust Center > Trusted Locations.',
        'For genuine corruption, use Microsoft\'s built-in repair before anything else: open PowerPoint (not the file), go to File > Open > Browse, navigate to the presentation, select it, then click the small dropdown arrow on the "Open" button and choose "Open and Repair." PowerPoint will attempt to salvage slides, and tell you what it recovered.',
        'If repair recovers only part of the deck, save the recovered version immediately under a new name, then try opening the original in PowerPoint\'s safe mode (`powerpnt /safe`) to rule out add-in interference before concluding the file is unrecoverable.',
        'As a last resort for valuable decks, try inserting the slides into a blank presentation: new blank deck > Home > New Slide dropdown > "Reuse Slides" > Browse > select the damaged file. This sometimes pulls slides that direct opening cannot.',
      ],
      tips:
        'The "Reuse Slides" trick works because it reads the file slide-by-slide rather than loading the whole package at once — damage confined to one slide\'s XML does not sink the rest. Also: never run "repair" tools from unknown vendors on a file containing sensitive content; Microsoft\'s built-in repair keeps everything on your machine.',
    },
    {
      os: 'mac',
      title: 'macOS: PowerPoint for Mac has no Open and Repair — use the workarounds',
      instructions: [
        'The bad news first: PowerPoint for Mac does not include the Open and Repair command — that is Windows-only. The good news: the diagnostic steps are the same, and the fixes mostly are too.',
        'macOS does not use Mark of the Web, so there is no Unblock checkbox — but Gatekeeper quarantines internet downloads, which can produce similar refusals. Right-click the file and choose Open (rather than double-clicking) to get the explicit "are you sure" dialog instead of a silent block.',
        'Run the PPTX-is-a-ZIP test: copy the file, rename the copy to .zip, and double-click — macOS Archive Utility will tell you quickly whether the container is intact.',
        'Try opening the file in Keynote (File > Open) or uploading it to the PowerPoint web app or Google Slides. If any of them open it, export/save a fresh copy from there — the re-exported file is usually clean.',
        'If nothing opens it and the ZIP test failed, the file is truncated or mislabeled — check its real type with a magic-byte tool before spending more time.',
      ],
      tips:
        'Keynote is an underrated diagnostic: it reads PPTX independently of Microsoft\'s code, so a file that opens in Keynote but not PowerPoint points squarely at the PowerPoint install rather than the file.',
    },
    {
      os: 'all',
      title: 'All platforms: verify the real type and try alternate readers',
      instructions: [
        'When a file behaves nothing like a presentation — tiny file size, opens as text, triggers odd prompts — verify its real type first with a magic-byte check. A genuine PPTX starts with the ZIP signature (50 4B 03 04); anything else means the file is mislabeled and "repairing" it is nonsense.',
        'Upload the file to the PowerPoint web app at office.com: it uses Microsoft\'s own rendering independent of your install, making it the cleanest "is it the file or my computer" test available.',
        'Google Slides and LibreOffice Impress are independent implementations — a file that opens in either but not PowerPoint exonerates the file.',
        'If the file is genuinely corrupted and valuable, and built-in repair failed, this is the only point where third-party recovery software enters the picture — research the vendor, prefer tools with free previews of recoverable content, and never pay before seeing what they can actually salvage.',
      ],
      tips:
        'Keep a known-good test presentation handy (even a one-slide blank deck). When a file fails, opening the test file first takes ten seconds and immediately tells you whether to blame the program or the file.',
    },
  ],
  measurableSecurityNotes: {
    verifiedAspects: [
      'The Properties > Security > Unblock indicator is authoritative for Mark-of-the-Web blocks — its presence deterministically explains refusals on downloaded files.',
      'The PPTX-is-a-ZIP test (renamed copy opens as an archive; header starts with 50 4B 03 04) verifies container integrity before any repair is attempted.',
      'The isolation sequence (known-good file, safe mode, web app) deterministically separates program faults from file faults.',
    ],
    antivirusDistinction:
      'These are diagnostic checks, not malware scans — they distinguish blocked, sandboxed, corrupted, and mislabeled files. A blocked or Protected View file is usually perfectly healthy; do not confuse a security precaution with an infection. Conversely, a file that opens fine can still be malicious (macro-enabled .pptm files can carry VBA) — scan unexpected presentations with current antivirus software regardless of how smoothly they open, and never enable macros or active content from untrusted senders.',
  },
  connectedTools: [],
  relatedExtensions: ['pptx'],
  relatedGuideIds: [
    'why-wont-my-file-open',
  ],
  faqs: [
    {
      question: 'Why does PowerPoint say it "found a problem with content" and offer to repair?',
      answer:
        'That message means PowerPoint detected structural damage — usually in the XML parts inside the PPTX package — but believes it can salvage something. Clicking "Repair" lets PowerPoint strip the damaged parts and recover the rest; always save the recovered version under a new name so the original stays untouched for further attempts. If repair recovers nothing, run the PPTX-is-a-ZIP test: a container that will not open as a ZIP either is truncated beyond what repair can fix.',
    },
    {
      question: 'What does the "Unblock" checkbox in file Properties actually do?',
      answer:
        'It removes Windows\' Mark-of-the-Web tag — the hidden Zone.Identifier marker Windows attaches to internet downloads. With the tag gone, Office treats the file as local and trusted instead of untrusted, so the block message or Protected View behavior stops. It does not modify the file\'s contents at all; it only changes how Windows vouches for its origin.',
    },
    {
      question: 'Is it safe to click "Enable Editing" on the Protected View banner?',
      answer:
        'For files you were expecting from senders you trust, yes — that is exactly what the button is for. For unexpected files, especially with urgent or odd messaging, no: Protected View is containing a file the system already distrusts, and enabling editing is the moment risk begins. When in doubt, verify the sender through a separate channel first.',
    },
    {
      question: 'Can I repair a PowerPoint file on a Mac?',
      answer:
        'PowerPoint for Mac has no Open and Repair command, so use the workarounds: the PPTX-is-a-ZIP test to check the container, Keynote or the PowerPoint web app to attempt opening, and re-export from whichever app succeeds. The web app is often the hero here — it runs Microsoft\'s own engine independent of your Mac install.',
    },
    {
      question: 'The file opens but slides are missing or garbled. Is it corrupted?',
      answer:
        'Likely partially — damage confined to individual slide XML parts. Try the "Reuse Slides" rescue: new blank presentation > Home > New Slide dropdown > Reuse Slides > Browse to the damaged file. It reads slide-by-slide, so healthy slides import even when the package will not open whole. Save whatever it recovers immediately, then decide whether the missing slides are worth professional recovery.',
    },
  ],
}
];