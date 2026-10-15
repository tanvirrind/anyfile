// Batch: 2 security guides (2026-10-15). Imported and spread into
// TECHNICAL_AUTHORITY_GUIDES in technicalAuthorityData.ts (keeps the database diff small).
import type { TechnicalAuthorityGuide } from './technicalAuthorityData';

export const TECHNICAL_AUTHORITY_BATCH_OCT2026: TechnicalAuthorityGuide[] = [
{
  id: 'can-a-pdf-contain-a-virus',
  slug: 'can-a-pdf-contain-a-virus',
  title: 'Can a PDF Contain a Virus? How PDFs Carry Malware',
  shortTitle: 'PDF Malware Explained',
  subtitle: 'A technical examination of how PDF files carry malicious behavior — JavaScript actions, embedded files, and launch actions — plus what antivirus scans can and cannot prove.',
  category: 'Security & Malware Mechanics',
  readTime: '9 min read',
  lastUpdated: 'October 2026',
  difficulty: 'Intermediate',
  author: {
    name: 'Tanveer Hussain',
    role: 'Founder, AnyFileX',
    avatar: ''
  },
  standardsAndRFCs: [
    { standard: 'ISO 32000-2:2020', title: 'Document management — Portable document format (PDF 2.0)', url: 'https://www.iso.org/standard/75839.html' },
    { standard: 'NIST SP 800-83 Rev. 1', title: 'Guide to Malware Incident Prevention and Handling for Desktops and Laptops', url: 'https://csrc.nist.gov/pubs/sp/800/83/r1/final' },
    { standard: 'MITRE ATT&CK T1204.002', title: 'User Execution: Malicious File', url: 'https://attack.mitre.org/techniques/T1204/002/' }
  ],
  executiveSummary: 'Yes — a PDF can carry malware. A PDF is not just a picture of a document; under ISO 32000 it is a programmable container that can hold JavaScript, embedded files, and launch actions. Attackers abuse those legitimate features to deliver payloads, which is why "but it is just a PDF" is not a safety argument. No single check proves a file safe — but verifying the file really is a PDF (magic bytes, not the extension) is the honest first layer of defense.',
  formalDefinition: 'A malicious PDF is a Portable Document Format file (ISO 32000) whose embedded active content — JavaScript actions, embedded file streams, launch actions, or URI actions — is crafted to exploit reader vulnerabilities or to socially engineer the user into executing a payload, rather than to render document content.',
  asciiFlowDiagram: `+-------------------------------------------------------------------------+
|              HOW A PDF CAN CARRY MALICIOUS BEHAVIOR                 |
+-------------------------------------------------------------------------+
  A PDF IS A CONTAINER, NOT JUST A DOCUMENT:
  invoice.pdf
  ├── Pages & text (what you see)
  ├── /JavaScript actions  <-- runs code in the reader on open/click
  ├── /EmbeddedFiles      <-- carries any file inside the PDF
  ├── /Launch action      <-- can trigger external programs (reader-gated)
  └── /URI action          <-- opens links (phishing vector)

  THE ATTACK PATH (MITRE T1204.002 — User Execution: Malicious File):
  Attacker emails "invoice.pdf"
        │
        ▼
  User opens it (trust: "it is just a PDF")
        │
        ▼
  Reader runs embedded JavaScript / user clicks "Enable content"
        │
        ▼
  Payload downloads or launches  <-- this is the infection moment

  THE HONEST FIRST CHECK:
  Filename says ".pdf"
        │
        ▼
  Read first bytes: 25 50 44 46 = "%PDF" ?
     YES -> it really is a PDF (still verify behavior below)
     NO  -> it is NOT a PDF — stop, do not open it`,
  engineWorkflow: [
    {
      stepNumber: 1,
      stageName: 'Header Signature Verification',
      description: 'Reads the first bytes of the file and checks for the %PDF- header marker. A genuine PDF always begins with these bytes; a file that claims to be a PDF but starts with executable or archive bytes is mislabeled and should not be opened.',
      engineMethod: 'verifyPdfHeaderSignature(buffer)'
    },
    {
      stepNumber: 2,
      stageName: 'Extension Parity Check',
      description: 'Compares the declared .pdf extension against the detected signature. Mismatches — including double extensions like invoice.pdf.exe — are the oldest trick for disguising executables as documents.',
      engineMethod: 'checkExtensionSignatureParity(extension, signature)'
    },
    {
      stepNumber: 3,
      stageName: 'Active Content Inventory',
      description: 'Scans the PDF object structure for the presence of JavaScript actions, embedded file streams, launch actions, and URI actions. Presence of these features does not prove malice — it determines how carefully the file must be handled.',
      engineMethod: 'inventoryPdfActiveContent(objectTree)'
    },
    {
      stepNumber: 4,
      stageName: 'Handling Recommendation',
      description: 'Routes the file to safe handling: open in a sandboxed reader with JavaScript disabled for unknown files, or in the browser preview for read-only needs. Never enable blocked content on a file from an untrusted sender.',
      engineMethod: 'recommendPdfHandlingProfile(riskSignals)'
    }
  ],
  byteAnalysisExamples: [
    {
      formatName: 'PDF Document',
      extension: 'pdf',
      offset: '0',
      hexBytes: '25 50 44 46 2D',
      asciiRepresentation: '%PDF-',
      significance: 'Every genuine PDF begins with the %PDF- header marker (ISO 32000). If a ".pdf" file does not start with these bytes, it is not a PDF — do not trust the extension.'
    }
  ],
  keyPrinciples: [
    {
      principle: 'A PDF Is a Program Container, Not Just a Document',
      explanation: 'The PDF specification (ISO 32000) defines far more than pages and text. A PDF can embed JavaScript that runs when the document opens, carry entire files inside itself, and trigger actions such as opening links or launching external programs. These are legitimate features — forms use JavaScript for validation, portfolios embed files — but they are exactly the features attackers abuse. Treating a PDF as "just a document" is the misconception every PDF attack relies on.',
      realWorldScenario: 'A finance department receives "Q3-invoice.pdf" from an unknown sender. It opens fine and looks like an invoice — but embedded JavaScript runs on open and silently downloads a second-stage payload. The visible content was only the bait.'
    },
    {
      principle: 'A Clean Antivirus Scan Does Not Prove Safety',
      explanation: 'Antivirus engines detect known threats by signatures and heuristics. A brand-new malicious PDF, a targeted attack built for one victim, or a PDF whose payload only activates after a user clicks "Enable Content" can all pass a scan. Scans are a useful layer — an engine flagging the file is a definitive stop sign — but a clean result is "no known threat found," not "proven safe." This is why handling discipline matters more than any single scan.',
      realWorldScenario: 'A targeted phishing PDF crafted for one company passes every scanner because its payload hash has never been seen before. The recipient, reassured by the clean scan, enables the blocked content — and that was the actual attack step.'
    },
    {
      principle: 'The Extension Is a Claim, the Header Is Evidence',
      explanation: 'Filenames are trivially renamed; the first bytes of a file are not. Before worrying about what is inside a PDF, confirm it is a PDF at all: genuine PDFs begin with the %PDF- marker. An "invoice.pdf" that actually starts with executable bytes is not a suspicious PDF — it is an executable wearing a costume, and no PDF-specific advice applies. This check takes seconds and eliminates an entire class of deception.',
      realWorldScenario: 'A user receives "contract.pdf" that will not open in their reader. Checking the header reveals archive bytes instead — the sender (or an attacker) mislabeled a ZIP file. The fix is renaming, not malware removal.'
    }
  ],
  deepDiveSections: [
    {
      heading: 'The Four PDF Features Attackers Abuse',
      content: 'To understand PDF risk, you need to know which parts of the specification do the work. All four are legitimate, documented ISO 32000 features — which is precisely why they are dangerous in the wrong hands.\n\n1. JavaScript actions (/JS, /JavaScript). PDFs can embed JavaScript that executes on document open, page view, or form events. Legitimate uses include form validation and dynamic content. Malicious uses include heap-spraying exploits against reader vulnerabilities and silent downloads. Modern readers run JavaScript in a restricted API, but restriction is not elimination — and users are routinely tricked into clicking through the warnings.\n\n2. Embedded files (/EmbeddedFiles). A PDF can carry complete files inside it — documents, spreadsheets, executables. The reader typically warns before extracting an executable, but the social engineering around it ("extract the attached invoice to view it") does the heavy lifting.\n\n3. Launch actions (/Launch). These can trigger external applications or commands. Readers gate them behind prominent warnings, but warning fatigue is real, and older or misconfigured readers have historically enforced the gating poorly.\n\n4. URI actions (/URI). The humble hyperlink. Many PDF attacks never exploit anything technical at all — the PDF is simply a trusted-looking wrapper around a phishing link. The reader did everything right; the user clicked anyway.',
      bulletPoints: [
        'JavaScript in PDFs is a specification feature, not a bug — disabling it in your reader removes the largest automated attack surface.',
        'Embedded files and launch actions always deserve a pause: ask why a document needs to carry a program.',
        'A PDF that is "just a link" can still be the whole attack — phishing does not need exploits.'
      ],
      technicalCallout: {
        type: 'security',
        title: 'Disable JavaScript for untrusted PDFs',
        message: 'In Adobe Acrobat Reader, JavaScript can be disabled under Preferences > JavaScript. For PDFs from unknown senders, this single setting neutralizes the most common automated attack path.'
      }
    },
    {
      heading: 'What Antivirus Scans Actually Prove (and Do Not)',
      content: 'It helps to be precise about what happens when you scan a file. A signature-based engine compares the file against a database of known malicious patterns; a heuristic engine looks for suspicious structures and behaviors. Both are valuable, and a detection should always be treated as final — delete the file.\n\nWhat a clean scan does not tell you: whether the file contains a threat nobody has catalogued yet, whether the malicious behavior only triggers after user interaction the scanner did not simulate, or whether the file is benign-but-mislabeled (a renamed executable sails past a PDF-focused scan). Scanners also cannot judge context — the same PDF with embedded JavaScript is a legitimate interactive form from your bank and a weapon from a stranger.\n\nThe practical takeaway: scan everything from untrusted sources, treat detections as absolute, but never treat a clean scan as permission to enable blocked content or ignore the other checks in this guide. Defense in depth — header verification, cautious handling, updated software — is the actual safety net; the scan is one strand of it.',
      bulletPoints: [
        'A detection means stop. A clean scan means "no known threat found" — not "safe."',
        'Targeted and brand-new threats are precisely the ones scanners are weakest against.',
        'Keep your PDF reader updated: most in-the-wild PDF attacks exploit patched vulnerabilities, not zero-days.'
      ]
    },
    {
      heading: 'Hash Checks: Integrity, Not Safety',
      content: 'You will often see advice to "check the hash" of a suspicious file. A cryptographic hash (such as SHA-256) is a fingerprint of the file\'s exact bytes: if even one byte changes, the hash changes completely. Hashes are excellent at answering one question — "is this file byte-identical to the known-good copy?" — which makes them perfect for verifying downloads against a publisher\'s published checksum.\n\nWhat hashes cannot do is judge intent. A hash tells you nothing about whether the bytes are malicious; it only tells you whether they match some reference. There is no universal registry of "safe file hashes" to check against. So: use hashes to confirm a download was not corrupted or tampered with in transit, and use the other techniques in this guide to judge whether the content itself is trustworthy. They solve different problems.',
      bulletPoints: [
        'Hash verification proves integrity against a trusted reference — use it for downloads from official sources.',
        'A hash cannot label a file safe or malicious on its own.',
        'Compute the hash locally; you never need to upload the file to fingerprint it.'
      ]
    },
    {
      heading: 'Verify the Real Type First: The 30-Second Check',
      content: 'Before any deeper analysis, answer the cheapest question: is this file actually a PDF? Open the file\'s first bytes with AnyFileX\'s Magic Byte Detector — a genuine PDF begins with the %PDF- marker. If the bytes say something else (executable, archive, script), stop: you are not dealing with a suspicious PDF, you are dealing with a mislabeled file, and every PDF-specific precaution is the wrong tool.\n\nNext, look at the filename with extensions visible (Windows hides them by default — turn on "File name extensions" in Explorer\'s View menu). Double extensions like invoice.pdf.exe are a classic: Windows may display only "invoice.pdf" while the real extension — the one the operating system acts on — is .exe. A PDF reader will not even open such a file; double-clicking it runs a program.\n\nThese two checks cost under a minute, require no uploads, and eliminate the most common deceptions outright. Only a file that passes both deserves the deeper handling judgment below.',
      bulletPoints: [
        'Magic bytes first: %PDF- header or it is not a PDF.',
        'Show file extensions in Windows Explorer — hidden extensions are the attacker\'s best friend.',
        'Treat invoice.pdf.exe as an executable, full stop.'
      ],
      technicalCallout: {
        type: 'info',
        title: 'Zero-upload verification',
        message: 'AnyFileX\'s Magic Byte Detector and File Identifier run entirely in your browser — the file never leaves your device during the check.'
      }
    },
    {
      heading: 'Safe Handling Habits for PDFs You Did Not Ask For',
      content: 'For a PDF from an untrusted or unexpected source, the safest workflow is boring on purpose. First, do the header and extension checks above. Second, open it in a sandboxed context: modern Adobe Acrobat Reader runs in Protected Mode (a sandbox) by default — keep it that way and do not disable it. Alternatively, preview the PDF in your browser, which renders it without the full reader feature set.\n\nThird, never enable blocked content on a stranger\'s file. If the reader warns about JavaScript, embedded files, or external links, that warning is the security system working — clicking through it is the attack succeeding. Fourth, keep the reader itself updated; the majority of real-world PDF compromises exploit vulnerabilities that already have patches, and the patch only helps if installed.\n\nFinally, apply the oldest rule in the book: unexpected attachment plus urgency ("open immediately or your account closes") is the shape of phishing regardless of file type. When in doubt, contact the supposed sender through a separate channel and ask whether they sent it.',
      bulletPoints: [
        'Keep Protected Mode / sandboxing enabled in your PDF reader.',
        'Preview in the browser for read-only needs — fewer features, smaller attack surface.',
        'Urgency plus attachment equals suspicion, every time.'
      ]
    }
  ],
  limitationsAndDistinctions: {
    whatItDoes: [
      'Explains, from the ISO 32000 specification, which PDF features can carry malicious behavior.',
      'Teaches header verification and extension-parity checks as the honest first layer of defense.',
      'Clarifies what antivirus scans and hash checks do and do not prove.'
    ],
    whatItDoesNotDo: [
      'Does not scan files for malware — AnyFileX identifies file types; it is not an antivirus engine.',
      'Does not analyze or execute embedded JavaScript or payloads.',
      'Does not provide instructions for creating malicious PDFs.'
    ],
    malwareVsIntegrityDistinction: 'A PDF with JavaScript or embedded files is not automatically malicious — these are legitimate specification features used by forms and portfolios every day. The distinction that matters is provenance and handling: the same active content is benign from a trusted sender and dangerous from a stranger. AnyFileX verifies what a file is; judging intent remains the user\'s job, aided by the handling habits above.'
  },
  connectedTools: [
    {
      name: 'Magic Byte Detector',
      description: 'Verify a ".pdf" file really starts with the %PDF- header before opening it.',
      route: { view: 'magic-byte-detector' },
      primary: true
    },
    {
      name: 'File Identifier',
      description: 'Identify the true type of a suspicious or mislabeled file from its binary signature.',
      route: { view: 'file-identifier' }
    }
  ],
  relatedGuides: [
    'what-are-macro-enabled-office-files',
    'how-file-extensions-can-be-spoofed',
    'what-is-a-zip-bomb'
  ],
  relatedExtensions: ['pdf', 'docm', 'pptx'],
  keyTermsGlossary: [
    { term: 'JavaScript Action', definition: 'A PDF action (/JS) that executes embedded JavaScript on events such as document open — a legitimate form feature and the most abused PDF attack vector.' },
    { term: 'Embedded File', definition: 'A complete file stream stored inside a PDF (/EmbeddedFiles), extractable by the reader — legitimate for portfolios, risky from strangers.' },
    { term: 'Launch Action', definition: 'A PDF action (/Launch) that can trigger an external application; readers gate it behind warnings.' },
    { term: 'Protected Mode', definition: 'Adobe Acrobat Reader\'s sandbox that isolates the rendering process from the rest of the system.' },
    { term: 'Hash', definition: 'A cryptographic fingerprint (e.g. SHA-256) of a file\'s exact bytes; proves integrity against a reference, not safety.' },
    { term: 'Mark-of-the-Web', definition: 'An NTFS metadata flag marking files downloaded from the internet, used by Windows and Office to apply stricter handling.' }
  ],
  faqs: [
    {
      question: 'Can simply opening a PDF infect my computer?',
      answer: 'It can, but only through the active features described above — typically JavaScript exploiting a reader vulnerability, or a social-engineering step where you enable blocked content. A PDF with no active content, opened in an updated reader, is about as dangerous as viewing an image. The risk is not the format; it is the features plus the reader version plus your clicks.'
    },
    {
      question: 'My antivirus says the PDF is clean. Is it safe now?',
      answer: 'Safer, not proven safe. Scans detect known threats; a new or targeted malicious PDF can pass every scanner. Keep the handling habits from this guide regardless: verify the header, do not enable blocked content from strangers, and keep your reader updated. A clean scan is one layer, not a verdict.'
    },
    {
      question: 'Does AnyFileX scan PDFs for viruses?',
      answer: 'No — and you should distrust any free online tool that claims to. AnyFileX identifies a file\'s true type from its magic bytes, which catches mislabeled files (like an executable renamed to .pdf) before you open them. It does not analyze payloads or detect malware; use a real antivirus engine for that layer.'
    },
    {
      question: 'Should I disable JavaScript in my PDF reader?',
      answer: 'For PDFs from untrusted sources, yes — it removes the largest automated attack surface, and most documents render fine without it. In Adobe Acrobat Reader this lives under Preferences > JavaScript. You can re-enable it when working with trusted interactive forms that genuinely need it.'
    },
    {
      question: 'A PDF asked me to "Enable Content" or allow a connection. What should I do?',
      answer: 'Do not, unless you were expecting that exact file from that exact sender. Those prompts are the reader\'s security system working correctly — the attack only succeeds if you click through. For unexpected files, preview in the browser or delete the file and ask the sender through a separate channel.'
    }
  ]
},
{
  id: 'how-to-check-if-a-file-is-safe-before-opening',
  slug: 'how-to-check-if-a-file-is-safe-before-opening',
  title: 'How to Check If a File Is Safe Before Opening It',
  shortTitle: 'Check File Safety',
  subtitle: 'A practical safety workflow: verify the file\'s real type, look up its hash instead of uploading it, and understand what cloud scanners do with your file before you trust them.',
  category: 'Security & Malware Mechanics',
  readTime: '10 min read',
  lastUpdated: 'October 2026',
  difficulty: 'Beginner',
  author: {
    name: 'Tanveer Hussain',
    role: 'Founder, AnyFileX',
    avatar: ''
  },
  standardsAndRFCs: [
    { standard: 'NIST SP 800-83 Rev. 1', title: 'Guide to Malware Incident Prevention and Handling for Desktops and Laptops', url: 'https://csrc.nist.gov/pubs/sp/800/83/r1/final' },
    { standard: 'CWE-434', title: 'Unrestricted Upload of File with Dangerous Type', url: 'https://cwe.mitre.org/data/definitions/434.html' }
  ],
  executiveSummary: 'You cannot prove a file safe with one click — but you can shrink the risk dramatically with a five-minute workflow. Verify the file really is what its name claims (magic bytes beat extensions), check where it came from, look up its cryptographic hash instead of uploading the file itself, and let your operating system\'s built-in protections do their job. And know this before you use a cloud scanner: services like VirusTotal upload your file to their servers and share it with the security community — fine for a random download, a terrible idea for a confidential document.',
  formalDefinition: 'File safety verification is a layered pre-execution assessment combining type authenticity checks (magic-byte verification), provenance evaluation, hash-based reputation lookup, and platform protection mechanisms — reducing, but never eliminating, the risk of executing malicious content.',
  asciiFlowDiagram: `+-------------------------------------------------------------------------+
|            THE INSPECT-WITHOUT-UPLOADING SAFETY WORKFLOW            |
+-------------------------------------------------------------------------+
  You receive a suspicious file: "invoice.pdf"
        │
        ▼
  STEP 1 — REAL TYPE CHECK (no upload, seconds)
  Read magic bytes ──► %PDF- ? ──► YES: it is a PDF, continue
                                  NO:  STOP — mislabeled file, do not open
        │
        ▼
  STEP 2 — PROVENANCE CHECK (no upload, seconds)
  Expected sender? Expected file? Unexpected + urgent = phishing shape
        │
        ▼
  STEP 3 — HASH LOOKUP (no upload, one minute)
  Compute SHA-256 LOCALLY ──► search the hash (not the file)
  on a threat-intel service ──► known-bad? delete. Unknown? continue
        │
        ▼
  STEP 4 — PLATFORM PROTECTIONS (automatic)
  SmartScreen / Gatekeeper / antivirus on-access scan
        │
        ▼
  STEP 5 — CAUTIOUS OPENING
  Sandboxed reader, macros disabled, never enable blocked content
  from an untrusted sender

  WHAT THIS WORKFLOW NEVER DOES:
  ✗ Upload your confidential file to a stranger's server just to
    ask "is this safe?"`,
  engineWorkflow: [
    {
      stepNumber: 1,
      stageName: 'Magic Byte Extraction',
      description: 'Reads the file\'s first bytes and matches them against the known signature table. This establishes ground truth about the file type before any other judgment is made.',
      engineMethod: 'extractFileSignature(buffer)'
    },
    {
      stepNumber: 2,
      stageName: 'Extension Parity Evaluation',
      description: 'Compares the detected type with the filename extension, flagging double extensions, hidden-extension tricks, and outright mismatches such as an executable labeled .pdf.',
      engineMethod: 'evaluateExtensionParity(detectedType, fileName)'
    },
    {
      stepNumber: 3,
      stageName: 'Local Hash Computation',
      description: 'Computes the file\'s SHA-256 fingerprint entirely on the user\'s device. The hash — not the file — is what gets looked up against threat intelligence, so confidential content never leaves the device.',
      engineMethod: 'computeSha256Local(buffer)'
    },
    {
      stepNumber: 4,
      stageName: 'Risk Signal Summary',
      description: 'Combines type authenticity, extension honesty, and hash reputation into a plain-language summary with a recommended handling posture: open normally, open cautiously, or do not open.',
      engineMethod: 'summarizeFileRiskSignals(signals)'
    }
  ],
  keyPrinciples: [
    {
      principle: 'Your Scanner Uploads Your File — Know That Before You Click',
      explanation: 'Cloud multi-scanners are genuinely useful: they run dozens of antivirus engines over a file at once. But the mechanism is an upload — your file travels to someone else\'s servers, where it is stored and shared with the security community and commercial partners. For a random installer from the internet, that trade is fine. For a confidential contract, an unreleased design, or personal photos, you have just published your private file to dozens of third parties to answer a question you could have answered locally. None of the guides ranking for this keyword mention that trade-off. Now you know it; choose accordingly.',
      realWorldScenario: 'An employee receives an unexpected "salary-review.pdf" and uploads it to a cloud scanner to be safe. The file is clean — but it is also now permanently stored on a third-party service, visible to that service\'s partners. The safety question was answered; a confidentiality incident was created.'
    },
    {
      principle: 'Look Up the Hash, Not the File',
      explanation: 'A SHA-256 hash is a fingerprint of the file\'s exact bytes — and threat-intel services let you search by hash alone. Compute the fingerprint on your own device (AnyFileX\'s Hash Generator does this in your browser, nothing uploaded), then paste the hash into the scanner\'s search. If the file is known malware, the hash matches and you have your answer with zero exposure. If the hash is unknown, you have learned it is uncommon — useful signal — without handing anyone your file. Only if you decide the file is non-sensitive should you consider a full upload.',
      realWorldScenario: 'A downloaded utility triggers a vague unease. Its SHA-256, searched on a threat-intel database, returns ten existing reports flagging it as a trojan dropper. Verdict reached in a minute; the file itself never left the laptop.'
    },
    {
      principle: 'No Single Check Proves Safety — Layers Do',
      explanation: 'Every verification technique answers a different question. Magic bytes answer "what is this really?" Provenance answers "should I have received this?" Hash lookup answers "is this exact file known-bad?" Platform protections answer "does anything on my system object?" Cautious handling answers "what is the blast radius if I am wrong?" A file that passes all five layers is not proven safe — nothing is — but it has survived five independent skeptical questions, which is the closest to "safe" that honestly exists.',
      realWorldScenario: 'A design agency receives client assets daily. Their routine — verify type, confirm the sender, hash-check executables, open documents in sandboxed readers — has caught mislabeled executables twice this year that every other check missed.'
    }
  ],
  deepDiveSections: [
    {
      heading: 'Step 1: Verify the Real File Type (60 Seconds, No Upload)',
      content: 'Start with the cheapest, most decisive check: is the file what its name claims? Drop it into AnyFileX\'s Magic Byte Detector or File Identifier — both run entirely in your browser, so nothing is uploaded. The tools read the file\'s header signature and tell you the true format.\n\nWhat you are hunting for: mismatches. A "document.pdf" whose bytes say executable, a "photo.jpg" whose bytes say script, a "video.mp4" that is actually an archive — each of these is a file lying about its identity, and a lying file deserves no further benefit of the doubt. Also watch for double extensions (invoice.pdf.exe): with Windows hiding extensions by default, the displayed name says PDF while the operating system sees an executable. Turn on "File name extensions" in Explorer\'s View menu and this entire trick dies.\n\nIf the type checks out — a real PDF, a real image, a real archive — continue to step 2. If it does not, stop here: you do not have a suspicious document, you have a disguised program, and the correct action is deletion, not deeper analysis.',
      bulletPoints: [
        'Magic bytes are ground truth; the filename is a claim.',
        'Enable "File name extensions" in Windows — hidden extensions enable the oldest trick in the book.',
        'A mismatch means stop, not "scan harder."'
      ],
      technicalCallout: {
        type: 'info',
        title: 'Zero-upload verification',
        message: 'AnyFileX\'s Magic Byte Detector, File Identifier, and Hash Generator all run entirely in your browser — your file never leaves your device during any check in this guide.'
      }
    },
    {
      heading: 'Step 2: Judge the Provenance (30 Seconds, No Tools Needed)',
      content: 'Before any technical check, ask the human questions — they catch what scanners cannot. Were you expecting this file? Does the sender\'s address match the person or company it claims to be, character for character? Does the message create urgency ("open immediately," "your account will be closed," "see the attached invoice")?\n\nPhishing economics explain why this step matters so much: attackers cannot afford to craft perfect lures for everyone, so they optimize for volume and urgency. The overwhelmingly common shape of a malicious file delivery is an unexpected attachment plus manufactured urgency from a lookalike sender. Legitimate senders almost never combine all three.\n\nTwo specific tells worth memorizing. First, the "shared document" email where the link or attachment was never discussed — real collaborators mention what they are sending. Second, the slightly-off sender domain: "micros0ft-support.com" instead of "microsoft.com," or a free-mail address for a company that uses its own domain. When provenance fails, the file does not need technical analysis — delete it and contact the supposed sender through a separate, trusted channel.',
      bulletPoints: [
        'Unexpected + urgent + attachment is the phishing shape — memorize it.',
        'Verify sender domains character by character; lookalikes are cheap to make.',
        'When in doubt, ask the sender out-of-band: "Did you just send me a file?"'
      ]
    },
    {
      heading: 'Step 3: The Hash Lookup — Threat Intel Without the Upload',
      content: 'Here is the technique the ranking guides skip. A SHA-256 hash uniquely fingerprints a file\'s exact bytes. Threat-intelligence databases index millions of these fingerprints with verdicts. And crucially, you can search by hash without uploading anything.\n\nThe workflow: compute the file\'s SHA-256 locally — AnyFileX\'s Hash Generator does this in your browser — then paste the resulting string into a threat-intel search. Three outcomes: (1) the hash is flagged malicious — delete the file, you are done; (2) the hash is known-clean or widely seen — reassuring but not conclusive; (3) the hash is unknown — the file is uncommon, which for executables from the internet is itself a yellow flag worth weighing.\n\nWhy this beats uploading: the hash reveals nothing about the file\'s contents. A hash of your confidential contract is just a random-looking string; the contract itself stays on your device. You get the reputation signal with zero confidentiality cost. Reserve full-file uploads for files you have already decided are non-sensitive — never as the first move on a private document.',
      bulletPoints: [
        'Compute SHA-256 locally, search the hash — the file never travels.',
        'Known-bad hash: delete. Unknown hash on an internet executable: treat as suspicious.',
        'Upload the file itself only after deciding it is non-sensitive.'
      ],
      technicalCallout: {
        type: 'security',
        title: 'What a hash cannot tell you',
        message: 'A hash lookup answers "is this exact file known-bad?" A brand-new or targeted threat has no recorded hash — an unknown result is not a clean bill of health. Combine with the other steps.'
      }
    },
    {
      heading: 'Step 4: Let Your Platform Protections Work (They Are Better Than You Think)',
      content: 'Your operating system already runs several of these checks automatically — if you have not disabled them. On Windows, SmartScreen checks downloaded files and applications against Microsoft\'s reputation data and warns on unrecognized programs; Defender\'s real-time protection scans files on access. On macOS, Gatekeeper verifies downloaded apps are signed and notarized, and XProtect provides baseline malware detection.\n\nThe practical advice is mostly negative: do not disable these. Every "how to turn off SmartScreen" tutorial is a small act of self-sabotage. Keep them on, keep the system updated, and pay attention when they object — an OS-level warning about a file you were already suspicious of is two independent signals agreeing.\n\nOne honest limitation: platform protections are tuned for common threats, not targeted ones, and they can be bypassed by user action (which is why every attack asks you to click "Run anyway" or "Open"). They are a layer, not a verdict — which is exactly why this guide has five steps instead of one.',
      bulletPoints: [
        'Keep SmartScreen / Gatekeeper / real-time protection enabled — always.',
        'System updates are security updates: install them.',
        'An OS warning plus your own suspicion is two signals — listen to both.'
      ]
    },
    {
      heading: 'Step 5: Open Cautiously — Contain the Blast Radius',
      content: 'When a file has passed the first four steps but still came from anywhere less than fully trusted, how you open it is the final control. The principle: give the file the smallest possible room to misbehave.\n\nFor documents, prefer sandboxed or reduced-feature contexts: preview in the browser instead of the full desktop reader, keep Protected Mode enabled in Adobe Acrobat Reader, and disable macros/JavaScript for files from untrusted senders (you can re-enable for trusted ones). For executables you have decided to run despite yellow flags, Windows Sandbox (built into Pro editions) or a virtual machine gives the program a disposable computer to misbehave in — when you close it, everything inside is discarded.\n\nAnd the eternal rule: never enable blocked content — macros, active content, "enable editing" — on a file from an untrusted sender. Those prompts are the security system working as designed. The attack, in the overwhelming majority of cases, only succeeds at the moment you click through.',
      bulletPoints: [
        'Browser preview and sandboxed readers shrink the attack surface for documents.',
        'A VM or sandbox is the honest answer for "I must run this untrusted program."',
        '"Enable Content" on a stranger\'s file is the attack succeeding — do not click it.'
      ]
    }
  ],
  limitationsAndDistinctions: {
    whatItDoes: [
      'Teaches a five-layer pre-execution workflow that works without uploading files.',
      'Explains the confidentiality trade-off of cloud multi-scanners honestly.',
      'Shows how to use hash-based reputation lookup as a no-upload alternative.'
    ],
    whatItDoesNotDo: [
      'Does not scan files for malware — AnyFileX identifies file types; it is not an antivirus engine.',
      'Does not provide a sandbox or virtual machine; those are OS features this guide explains how to use.',
      'Cannot prove any file safe — no technique can; the workflow reduces risk, it does not eliminate it.'
    ],
    malwareVsIntegrityDistinction: 'This guide is about pre-execution risk reduction, not malware removal. If a file is already confirmed malicious — by a hash hit, an antivirus detection, or platform warning — the correct action is deletion, possibly followed by a full system scan per NIST SP 800-83 incident handling. Verification workflows prevent execution; they do not clean infections.'
  },
  connectedTools: [
    {
      name: 'Magic Byte Detector',
      description: 'Verify a suspicious file\'s true type from its header signature — no upload.',
      route: { view: 'magic-byte-detector' },
      primary: true
    },
    {
      name: 'File Identifier',
      description: 'Identify unknown or mislabeled files from their binary structure.',
      route: { view: 'file-identifier' }
    },
    {
      name: 'Hash Generator',
      description: 'Compute a file\'s SHA-256 locally, then look up the hash instead of uploading the file.',
      route: { view: 'hash-generator' }
    }
  ],
  relatedGuides: [
    'how-file-extensions-can-be-spoofed',
    'what-are-macro-enabled-office-files',
    'what-is-a-zip-bomb'
  ],
  relatedExtensions: ['pdf', 'docm', 'pptx'],
  keyTermsGlossary: [
    { term: 'Magic Bytes', definition: 'The header signature bytes at the start of a file that identify its true format, independent of the filename.' },
    { term: 'SHA-256', definition: 'A cryptographic hash function producing a 256-bit fingerprint of a file\'s exact bytes; any byte change alters the hash completely.' },
    { term: 'Threat Intelligence', definition: 'Databases of known-malicious file hashes, URLs, and indicators maintained by the security community.' },
    { term: 'Sandbox', definition: 'An isolated execution environment (e.g. Windows Sandbox, a VM) where untrusted programs run without reaching the real system.' },
    { term: 'SmartScreen', definition: 'Windows reputation-based protection that warns about unrecognized downloads and applications.' },
    { term: 'Mark-of-the-Web', definition: 'An NTFS metadata flag marking files downloaded from the internet, used by Windows and Office to apply stricter handling.' }
  ],
  faqs: [
    {
      question: 'Is it safe to upload a suspicious file to VirusTotal?',
      answer: 'It depends on the file. Technically effective — dozens of engines is genuinely useful — but your file is uploaded, stored, and shared with the vendor\'s security community and partners. For a random internet download, that trade is usually fine. For anything confidential — contracts, personal photos, unreleased work — do the hash lookup described in this guide instead. Never upload a private file just to satisfy curiosity.'
    },
    {
      question: 'Can I check a file for viruses without any antivirus installed?',
      answer: 'Partially. The magic-byte check, provenance judgment, and hash lookup in this guide need no antivirus and catch mislabeled files and known-bad payloads. But they cannot catch brand-new malware the way behavioral engines try to. For a system without any protection, Microsoft Defender (built into Windows) is free and already there — turn it on rather than relying on manual checks alone.'
    },
    {
      question: 'Does AnyFileX scan files for malware?',
      answer: 'No. AnyFileX identifies what a file really is from its magic bytes and computes hashes locally — both run entirely in your browser with no upload. It does not detect or remove malware. Think of it as the honest first layer (is this file what it claims to be?) before your antivirus and your own judgment do the rest.'
    },
    {
      question: 'A file passed every check here. Is it definitely safe?',
      answer: 'No — and anyone promising certainty is selling something. What passing all five layers means is that the file survived five independent skeptical questions: authentic type, plausible provenance, no known-bad reputation, no platform objection, and contained handling. That is the practical definition of "safe enough to proceed carefully," which is the best the field honestly offers.'
    },
    {
      question: 'What should I do if a check says the file is malicious?',
      answer: 'Delete it — do not open it "just to see." If you already opened or ran it, disconnect from the network and run a full scan with your antivirus, following the incident-handling steps in NIST SP 800-83. If it was a work device, tell your IT/security team; targeted malware is their problem to hunt, not yours to solve alone.'
    }
  ]
}
];
