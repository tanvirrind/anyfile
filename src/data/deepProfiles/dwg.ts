import { DeepFormatProfile, DeepProfileSection } from './types';

/**
 * Deep content profile for DWG — the AutoCAD drawing format.
 *
 * Built against the "dwg file" keyword cluster (head term ~8.1k/mo US, CPC $1.65;
 * "dwg file viewer" ~1.9k; "dwg file converter" ~390) and the observed
 * People-Also-Ask set: what a DWG is, opening one without AutoCAD, DWG vs DXF,
 * Mac and mobile viewing, TrueView, and whether the format is proprietary.
 *
 * Honesty constraints baked into this copy (do not remove):
 *  - AnyFileX does not render or convert DWG in the browser. It identifies and
 *    verifies files locally. Never claim a working DWG viewer/converter here.
 *  - The /converters/dwg-* pages currently resolve to an "unsupported pair" state,
 *    so this profile links the converter hub rather than those pair pages.
 */

const DWG_SECTIONS: DeepProfileSection[] = [
  {
    id: 'what-is-a-dwg-file',
    h2: 'What Is a DWG File?',
    html: `<p>A <strong>DWG file</strong> is a proprietary binary <strong>CAD</strong> (computer-aided design) drawing created by <strong>Autodesk</strong>, and the native format of <strong>AutoCAD</strong>. Unlike a flat image, a DWG stores <strong>vector graphics</strong> — geometry held as mathematical coordinates rather than pixels — together with the working metadata a drafter needs: <strong>layers</strong>, <strong>blocks</strong>, external references (<strong>xrefs</strong>), <strong>dimensions</strong>, <strong>annotations</strong>, <strong>linetypes</strong>, <strong>text styles</strong>, <strong>viewports</strong>, and both 2D and 3D entities.</p>
      <p>A drawing is organised across <strong>model space</strong> (the geometry itself) and <strong>paper space</strong> or <strong>layouts</strong> (the printable sheets). The file extension is <code>.dwg</code> and the registered <strong>MIME type</strong> is <code>image/vnd.dwg</code>, also seen in the wild as <code>application/acad</code>.</p>
      <p>Because DWG is proprietary, non-Autodesk applications read it through reverse-engineered libraries — most notably those maintained by the <strong>Open Design Alliance (ODA)</strong> and the open-source <strong>LibreDWG</strong> project. That is why the same drawing can open perfectly in one CAD program and display missing or flattened entities in another.</p>`,
  },
  {
    id: 'what-does-dwg-stand-for',
    h2: 'What Does DWG Stand For?',
    html: `<p>The letters <strong>DWG</strong> stand for <strong>“drawing”</strong>. The format goes back to the very beginning of AutoCAD: Autodesk shipped AutoCAD 1.0 — and with it the first DWG files — in 1982, building on Mike Riddle’s earlier Interact CAD work from the late 1970s.</p>
      <p>In everyday use a “DWG file” simply means a CAD drawing saved by AutoCAD or a compatible editor such as <strong>DraftSight</strong>, <strong>BricsCAD</strong>, <strong>ZWCAD</strong>, <strong>IntelliCAD</strong>, or <strong>CorelCAD</strong>. The companion format is <strong>DXF</strong> (<em>Drawing Exchange Format</em>), the documented exchange counterpart that almost every CAD and CNC tool can read.</p>`,
  },
  {
    id: 'dwg-version-codes',
    h2: 'DWG Version Codes Explained (AC1006 → AC1032)',
    html: `<p>Every DWG file starts with a short <strong>header code</strong> — the <strong>magic bytes</strong> <code>AC10…</code> — that identifies the exact format version before any geometry is read. If a drawing refuses to open, an incompatible version header is the most common reason: newer software opens older drawings, but older software cannot open newer ones.</p>
      <p>You do not need AutoCAD to check the version. Read the first six ASCII bytes in any hex viewer, or drop the file into AnyFileX’s File Identifier or Magic Byte Detector — both read the header locally in your browser and report the DWG version, MIME type, and checksum without uploading the drawing.</p>`,
    table: {
      caption: 'DWG header codes by AutoCAD release',
      headers: ['Header code', 'AutoCAD release', 'Year'],
      rows: [
        ['AC1006', 'AutoCAD R10', '1988'],
        ['AC1009', 'AutoCAD R11 / R12', '1990–1992'],
        ['AC1012', 'AutoCAD R13', '1994'],
        ['AC1014', 'AutoCAD R14', '1997'],
        ['AC1015', 'AutoCAD 2000', '1999'],
        ['AC1018', 'AutoCAD 2004', '2003'],
        ['AC1021', 'AutoCAD 2007', '2006'],
        ['AC1024', 'AutoCAD 2010', '2009'],
        ['AC1027', 'AutoCAD 2013', '2012'],
        ['AC1032', 'AutoCAD 2018 and later', '2017–now'],
      ],
    },
  },
  {
    id: 'how-to-open-a-dwg-file',
    h2: 'How to Open a DWG File (Windows, Mac & Mobile)',
    html: `<p>Short answer: use <strong>AutoCAD</strong> if you have it, <strong>Autodesk Viewer</strong> in a browser if you do not, or <strong>DWG TrueView</strong> if you are on Windows and only need to view and plot. Viewing a drawing is free in every case; editing needs CAD software.</p>`,
    steps: [
      {
        title: 'Check the version header first',
        desc: 'Confirm the file is really a DWG and note its version code (AC1021 = 2007, AC1032 = 2018+). If the drawing is newer than your software, save or convert it down before opening.',
      },
      {
        title: 'View it free without a licence',
        desc: 'Open the drawing in Autodesk Viewer in any modern browser, or install DWG TrueView on Windows. Both render layers, layouts, and line weights for reading and plotting.',
      },
      {
        title: 'Open it in full CAD to edit',
        desc: 'Use AutoCAD, AutoCAD LT, DraftSight, BricsCAD, or ZWCAD when you need to modify geometry, edit xrefs, or run commands such as PURGE, AUDIT, and OVERKILL.',
      },
      {
        title: 'Inspect and verify the file locally',
        desc: 'If you only need to know what a file is — its version, MIME type, magic bytes, metadata, or hash — use the browser tools instead of uploading a confidential drawing anywhere.',
      },
    ],
  },
  {
    id: 'open-dwg-without-autocad',
    h2: 'Can You Open a DWG File Without AutoCAD?',
    html: `<p>Yes. Several tools read DWG files without an Autodesk licence, and the practical choice usually comes down to whether you need to <em>view</em> the drawing or <em>edit</em> it.</p>`,
    list: [
      '<strong>Autodesk Viewer</strong> — free, runs in the browser, no install. Best first stop for a quick look.',
      '<strong>DWG TrueView</strong> — Autodesk’s free standalone viewer for Windows; views, plots, and publishes, but cannot edit.',
      '<strong>ODA File Converter</strong> — free, batch converts DWG between versions and to DXF using the Open Design Alliance libraries.',
      '<strong>DraftSight</strong> — CAD with a free tier; reads and edits DWG directly.',
      '<strong>BricsCAD</strong> and <strong>ZWCAD</strong> — commercial AutoCAD alternatives with native DWG support and free trials.',
      '<strong>LibreCAD</strong> and <strong>QCAD</strong> — open source; strongest with DXF, with limited DWG reading.',
      '<strong>FreeCAD</strong> — open source parametric CAD that imports DWG when the ODA converter is installed.',
    ],
  },
  {
    id: 'open-dwg-on-mac',
    h2: 'How to Open a DWG File on a Mac',
    html: `<p>This is the most common dead end with DWG files: <strong>DWG TrueView is Windows-only</strong>, so the free viewer most guides recommend simply does not exist on macOS. Mac users need a different route.</p>
      <p>The fastest option is <strong>Autodesk Viewer</strong> in Safari or Chrome — no install, and it respects layers and layouts. If you need a desktop application, <strong>AutoCAD for Mac</strong>, <strong>BricsCAD for Mac</strong>, and <strong>DraftSight</strong> all open DWG natively, while <strong>QCAD</strong> and <strong>LibreCAD</strong> cover lighter viewing and DXF work. To move a drawing back to Windows-only software, convert it down with the free <strong>ODA File Converter</strong> first.</p>`,
  },
  {
    id: 'open-dwg-on-iphone-android',
    h2: 'View DWG Files on iPhone, iPad & Android',
    html: `<p>You can read a DWG drawing on a phone or tablet without a desktop: <strong>Autodesk Viewer</strong> works in mobile browsers, and Autodesk’s free mobile apps plus <strong>DWG FastView</strong> add pan, zoom, and layer toggling.</p>
      <p>One warning worth heeding: search results for DWG viewers are full of unofficial “mod APK” builds. Those are repackaged applications with no security review, and they are a routine malware and data-theft vector. Install viewers only from the official App Store, Play Store, or the vendor’s own site.</p>`,
  },
  {
    id: 'dwg-vs-dxf',
    h2: 'DWG vs DXF: What Is the Difference?',
    html: `<p>The two formats are siblings, and the distinction explains most CAD interoperability problems. <strong>DWG</strong> is Autodesk’s closed, binary working format. <strong>DXF</strong> (<em>Drawing Exchange Format</em>) is the documented exchange format Autodesk published so other programs could read the geometry.</p>
      <p>The practical rule: keep DWG as your working file, and export DXF whenever something outside the CAD world needs to read the geometry — a CNC router, a laser cutter, a signage plotter, or a third-party analysis tool.</p>`,
    table: {
      caption: 'DWG vs DXF at a glance',
      headers: ['Aspect', 'DWG', 'DXF'],
      rows: [
        ['Purpose', 'Native working drawing format', 'Interoperability / exchange format'],
        ['Encoding', 'Binary (compact, fast)', 'ASCII text, or binary variant'],
        ['Specification', 'Proprietary — no public spec', 'Documented by Autodesk, widely implemented'],
        ['Version markers', 'Header codes AC1006 – AC1032', 'Version tags (AC1009, AC1015, AC1018 …)'],
        ['Typical software', 'AutoCAD, DraftSight, BricsCAD, ZWCAD', 'Almost every CAD, CAM and vector tool'],
        ['Real-world friction', 'Other apps read it via reverse-engineered libraries', 'Occasional entity loss on complex drawings'],
        ['Best for', 'Editing, drafting, production drawings', 'Sharing with CNC, laser and third-party tools'],
      ],
    },
  },
  {
    id: 'how-to-convert-dwg',
    h2: 'How to Convert a DWG File (PDF, DXF & Images)',
    html: `<p>Converting a drawing is really <em>plotting</em> it — the output quality depends on the CAD engine doing the work, because a DWG holds vector geometry that has to be interpreted, not just re-encoded.</p>
      <p><strong>Vector-accurate conversion needs a CAD engine.</strong> Simply renaming a .dwg, or screenshotting it, loses scale, layers, line weights and text searchability. Browser tools that claim to convert DWG either upload your drawing to a server-side CAD engine or ship a WASM build of the ODA libraries — worth knowing before you hand over a confidential site plan. AnyFileX does not render or convert DWG in the browser; it identifies and verifies the file instead.</p>`,
    steps: [
      {
        title: 'DWG → PDF inside CAD',
        desc: 'Use PLOT and choose the DWG To PDF.pc3 plotter. Set the paper size, pick a plot style table so line weights survive, and enable “Plot with plot styles”. This produces a true vector PDF rather than a raster export.',
      },
      {
        title: 'DWG → DXF',
        desc: 'Use SAVEAS and select an ASCII DXF version, or batch-convert a folder with the free ODA File Converter. Check that hatches, xrefs, and text styles survived the round trip.',
      },
      {
        title: 'DWG → PNG / JPG',
        desc: 'Use EXPORT or plot to a raster driver, and raise the DPI (300+) so dimensions and fine annotations stay legible. Raster output is for presentation, never for measuring.',
      },
      {
        title: 'Verify the result',
        desc: 'Confirm both files are intact — check the DWG header code and compute a checksum of the source before and after conversion to prove nothing was silently altered.',
      },
    ],
  },
  {
    id: 'dwg-to-older-version',
    h2: 'Saving a DWG to an Older Version (2007, 2013, R14)',
    html: `<p>Older AutoCAD releases refuse to open drawings saved in a newer format, so downgrading is the standard fix when a client, contractor, or fabrication shop is on legacy software. Newer software always opens older drawings; the reverse never works.</p>
      <p>One caution: downgrading can flatten or drop entities introduced in later releases — newer dynamic block behaviour, certain 3D solids, and some annotation objects may not survive. Always keep the original file.</p>`,
    steps: [
      {
        title: 'Save As the target version',
        desc: 'In AutoCAD use SAVEAS and pick the older type, for example “AutoCAD 2007/LT2007 Drawing (*.dwg)” for AC1021 or “AutoCAD 2013 Drawing (*.dwg)” for AC1027.',
      },
      {
        title: 'Or use DWG Convert / ODA File Converter',
        desc: 'DWG Convert handles batches with version presets, and the free ODA File Converter does the same without an Autodesk licence — useful for archive folders.',
      },
      {
        title: 'Confirm the downgrade worked',
        desc: 'Re-check the header code of the saved file to confirm it now reports the older version before sending it on.',
      },
    ],
  },
  {
    id: 'reduce-dwg-file-size',
    h2: 'How to Reduce DWG File Size',
    html: `<p>Bloated drawings slow every open, save, and plot. The bulk almost always comes from unused definitions and redundant geometry rather than the visible linework. A typical cleanup, in order of payoff:</p>`,
    list: [
      '<strong>PURGE</strong> — remove unreferenced layers, blocks, linetypes, text styles, and registered applications.',
      '<strong>AUDIT</strong> — repair the drawing database and fix internal errors before they compound.',
      '<strong>OVERKILL</strong> — delete duplicate and overlapping geometry left behind by repeated edits.',
      'Detach unused <strong>xrefs</strong> and unload embedded raster images.',
      '<strong>WBLOCK</strong> the geometry you actually need into a clean new drawing.',
      'Turn off proxy graphics and save with thumbnail previews disabled.',
      'Move raster imagery out of the drawing and link it instead of embedding it.',
      'Compress for transport — a DWG is uncompressible binary data, so a ZIP archive is the only safe way to shrink it for email.',
    ],
  },
  {
    id: 'recover-corrupt-dwg',
    h2: 'How to Recover a Corrupt or Damaged DWG File',
    html: `<p>Before assuming a drawing is lost, check whether its header is still intact. A truncated or zero-length header is unrecoverable, but a valid <code>AC10…</code> header with internal errors usually is not — AutoCAD can rebuild the database around it. Work through these steps in order:</p>`,
    steps: [
      {
        title: 'Look for the autosave and backup files',
        desc: 'Search the drawing folder and your temp directory for matching .bak and .sv$ files, then rename the .sv$ copy to .dwg and open it. This rescues the most work with the least effort.',
      },
      {
        title: 'Run RECOVER, not OPEN',
        desc: 'File → Drawing Utilities → Recover deliberately attempts repair, whereas a normal OPEN silently skips damaged entities and can look like data loss.',
      },
      {
        title: 'Run AUDIT and accept the fixes',
        desc: 'AUDIT reports and repairs structural errors in the drawing database. Run it repeatedly until it reports no further errors.',
      },
      {
        title: 'Insert the drawing into a clean file',
        desc: 'Start a new empty drawing and INSERT the damaged one. AutoCAD rebuilds the object database as it imports, which clears many corruptions.',
      },
      {
        title: 'Salvage partial geometry',
        desc: 'If the drawing still will not open, use DXFOUT from a recovered copy to export the geometry that remains readable and rebuild the rest from there.',
      },
    ],
  },
  {
    id: 'is-dwg-safe',
    h2: 'Is a DWG File Safe to Open? Macros, TrustedDWG & Security',
    html: `<p>A DWG is data, not an executable program, but it is not inert. Drawings can carry <strong>AutoLISP</strong> routines and <strong>VBA macros</strong>, embedded objects, and external references that fetch content from paths you did not choose. The format also has a genuine security history: during the 2006–07 <strong>TrustedDWG</strong> dispute, Autodesk warned that files saved by non-Autodesk applications could be unreliable — which is the origin of the warning banner many AutoCAD users still see.</p>
      <p>Practical precautions: disable automatic macro loading (SECURELOAD), never enable macros in a drawing from an untrusted source, open suspect drawings in a sandbox or virtual machine, and verify what the file actually is before your CAD application touches it.</p>`,
    list: [
      'Confirm the magic bytes really are <code>AC10…</code> — a renamed file is a classic delivery trick.',
      'Check the MIME type and reported version against what you were told to expect.',
      'Record a checksum (MD5/SHA-256) on receipt so you can prove the drawing was not altered in transit.',
      'Strip author metadata before sharing drawings outside your organisation.',
    ],
  },
  {
    id: 'dwg-structure-glossary',
    h2: 'DWG File Structure: Layers, Blocks, Xrefs & Layouts',
    html: `<p>The vocabulary of a DWG file maps directly onto the way CAD drawings are built, and it is the fastest way to understand why one viewer shows something another misses.</p>`,
    list: [
      '<strong>Layers</strong> — named organisational bands that group geometry and carry colour, linetype, and line-weight properties.',
      '<strong>Blocks</strong> — reusable named symbol definitions, instanced many times across a drawing (doors, bolts, fixtures).',
      '<strong>Xrefs (external references)</strong> — links to other drawings that display inside the current file without being merged into it.',
      '<strong>Model space</strong> — the unbounded coordinate space holding the actual geometry, usually at 1:1 scale.',
      '<strong>Paper space / layouts</strong> — the printable sheets that reference views of model space at a chosen scale.',
      '<strong>Viewports</strong> — windows inside a layout that frame and scale a view into model space.',
      '<strong>Dimensions and annotations</strong> — associative measurement and labelling objects that update with the geometry.',
      '<strong>Linetypes and text styles</strong> — named definitions controlling dashes, weights, and fonts.',
      '<strong>Header code</strong> — the AC10xx version marker at the start of the file.',
      '<strong>Proxy objects</strong> — custom objects from third-party applications, stored as placeholders when the creating app is absent.',
      'Related formats: <strong>DXF</strong> (exchange), <strong>DWF</strong> (view and markup), <strong>DWT</strong> (template), <strong>DWS</strong> (standards), plus interchange neighbours <strong>STL</strong>, <strong>STEP</strong>, <strong>IGES</strong>, <strong>IFC</strong>, and <strong>DGN</strong>.',
    ],
  },
  // __DWG_SECTIONS_PART_3__
];

export const DWG_DEEP_SECTIONS = DWG_SECTIONS;

export const DWG_DEEP_PROFILE: DeepFormatProfile = {
  keywords: [
    'dwg file',
    'dwg files',
    'dwg file viewer',
    'dwg file extension',
    'file extension dwg',
    'dwg file converter',
    'what is a dwg file',
    'open dwg file',
    'open dwg without autocad',
    'dwg to pdf',
    'dwg to dxf',
    'dwg viewer online',
    'dwg vs dxf',
    'dwg version codes',
    'dwg trueview',
    'dwg file recovery',
    'reduce dwg file size',
  ],
  title: 'DWG File: What It Is & How to Open One Without AutoCAD',
  metaDescription:
    'What is a DWG file? Learn what DWG stands for, how to open DWG files on Windows, Mac and mobile without AutoCAD, plus DWG vs DXF, version codes and repair.',
  definition:
    'A DWG file is the native binary CAD drawing format created by Autodesk in 1982 for AutoCAD. It stores 2D and 3D vector geometry together with layers, blocks, external references, dimensions and metadata for architectural, engineering and manufacturing drawings. DWG stands for “drawing”.',
  sections: DWG_SECTIONS,
  relatedLinks: [
    { href: '/how-to-open/dwg', label: 'How to open .DWG files on every platform' },
    { href: '/compare/dwg-vs-dxf', label: 'DWG vs DXF — full comparison' },
    { href: '/guides/dwg-guide', label: 'DWG format guide' },
    { href: '/category/cad-3d', label: 'All CAD & 3D file formats' },
    { href: '/tools/file-identifier', label: 'Identify a .DWG file and read its version header' },
    { href: '/tools/magic-byte-detector', label: 'Magic Byte Detector (AC10xx header)' },
    { href: '/tools/mime-checker', label: 'MIME Type Checker' },
    { href: '/tools/hash-generator', label: 'Hash Generator (verify a drawing)' },
    { href: '/tools/metadata-viewer', label: 'Metadata Viewer' },
    { href: '/troubleshoot', label: 'Corrupt file repair guides' },
    { href: '/file-extensions/dxf', label: '.DXF — Drawing Exchange Format' },
    { href: '/file-extensions/dgn', label: '.DGN — Bentley MicroStation' },
    { href: '/file-extensions/step', label: '.STEP — ISO 10303' },
    { href: '/file-extensions/iges', label: '.IGES — CAD interchange' },
    { href: '/file-extensions/ifc', label: '.IFC — BIM model exchange' },
    { href: '/file-extensions/stl', label: '.STL — 3D printing' },
    { href: '/software/autocad', label: 'Autodesk AutoCAD' },
    { href: '/software/draftsight', label: 'DraftSight' },
    { href: '/software/bricscad', label: 'BricsCAD' },
    { href: '/software/librecad', label: 'LibreCAD' },
    { href: '/software/qcad', label: 'QCAD' },
    { href: '/software/freecad', label: 'FreeCAD' },
  ],
  howTo: {
    name: 'How to open a DWG file without AutoCAD',
    steps: [
      {
        name: 'Confirm the file is a real DWG',
        text: 'Check that the first six bytes are the ASCII header code AC10xx — this also tells you which AutoCAD version saved it.',
      },
      {
        name: 'Open it in a free viewer',
        text: 'Use Autodesk Viewer in a browser, or DWG TrueView on Windows, to view and plot the drawing at no cost.',
      },
      {
        name: 'Downgrade the version if needed',
        text: 'If your software is older than the drawing, save it down with Save As (DWG 2007/2013) or the free ODA File Converter.',
      },
      {
        name: 'Open it in CAD to edit',
        text: 'Use AutoCAD, DraftSight, BricsCAD, or ZWCAD when you need to change geometry, edit xrefs, or run PURGE, AUDIT and OVERKILL.',
      },
    ],
  },
  faqs: [
    {
      q: 'What is a DWG file?',
      a: 'A DWG file is the native binary drawing format of Autodesk AutoCAD, introduced in 1982. It stores 2D and 3D vector geometry along with layers, blocks, external references, dimensions and metadata, which is why CAD applications — not image viewers — are needed to read it properly.',
    },
    {
      q: 'How do I open a DWG file?',
      a: 'Open it with AutoCAD or another CAD application to edit it. To view it free, use Autodesk Viewer in a browser or DWG TrueView on Windows. If the drawing is newer than your software, save or convert it to an older DWG version first.',
    },
    {
      q: 'Can I open a DWG file without AutoCAD?',
      a: 'Yes. Autodesk Viewer (browser, free), DWG TrueView (Windows, free), DraftSight, BricsCAD, ZWCAD, and the open-source QCAD or LibreCAD all read DWG files. Free tools view and plot drawings; editing generally requires a CAD licence.',
    },
    {
      q: 'How do I convert DWG to PDF?',
      a: 'Use PLOT inside CAD software and choose the DWG To PDF.pc3 plotter, keeping “Plot with plot styles” enabled so line weights are preserved. That produces a true vector PDF with working layers and searchable text, unlike a screenshot.',
    },
    {
      q: 'What programs open DWG files?',
      a: 'AutoCAD, AutoCAD LT, AutoCAD Web and Mobile, DraftSight, BricsCAD, ZWCAD, IntelliCAD, CorelCAD, QCAD, LibreCAD, FreeCAD (with the ODA converter), plus the free viewers Autodesk Viewer and DWG TrueView.',
    },
    {
      q: 'What is the difference between DWG and DXF?',
      a: 'DWG is Autodesk’s proprietary binary working format. DXF (Drawing Exchange Format) is the documented exchange format that other programs can implement, which is why DWG is used for drafting and DXF is used to hand geometry to CNC, laser and third-party tools.',
    },
    {
      q: 'How do I open a DWG file on a Mac?',
      a: 'DWG TrueView does not exist on macOS, so use Autodesk Viewer in Safari or Chrome, or install AutoCAD for Mac, BricsCAD for Mac, or DraftSight. QCAD and LibreCAD are lighter free options, strongest with DXF, and ODA File Converter handles version downgrades.',
    },
    {
      q: 'Can I open DWG files on my phone or iPhone?',
      a: 'Yes — Autodesk Viewer works in mobile browsers and Autodesk’s mobile apps plus DWG FastView add pan, zoom and layer controls. Avoid unofficial “mod APK” builds of DWG viewers, which are a common malware and data-theft route.',
    },
    {
      q: 'Is DWG a proprietary format?',
      a: 'Yes. DWG is proprietary to Autodesk and has no public specification, so other applications read it through reverse-engineered libraries, notably from the Open Design Alliance (ODA) and the open-source LibreDWG project. This is why entity support can vary between programs.',
    },
    {
      q: 'What is DWG TrueView?',
      a: 'DWG TrueView is Autodesk’s free standalone DWG viewer for Windows. It opens, plots and publishes drawings and can convert between DWG versions, but it cannot edit geometry. There is no macOS version, which is why Mac users default to Autodesk Viewer in the browser.',
    },
    {
      q: 'How do I view DWG files for free?',
      a: 'In order: Autodesk Viewer in any browser, DWG TrueView on Windows, DraftSight’s free tier, and QCAD or LibreCAD for light work. All of them view drawings at no cost; none of the free viewers lets you edit production geometry.',
    },
    {
      q: 'What does DWG stand for?',
      a: 'DWG stands for “drawing”. The name dates to AutoCAD 1.0 in 1982 and simply denotes a CAD drawing file saved by AutoCAD or a compatible editor such as DraftSight, BricsCAD, ZWCAD or CorelCAD.',
    },
  ],
};
