import Link from 'next/link';
import { ExtensionDetailClient } from '@/components/extensions/ExtensionDetailClient';
import { FileIdentifierRouteClient } from '@/components/routes/RouteClients';
import { getOrGenerateExtensionInfo } from '@/lib/seo/extensionGenerator';
import { DutchNewsletter } from './DutchNewsletter';

const heic = getOrGenerateExtensionInfo('heic');

export function DutchHomePage() {
  const popularFormats = [
    { extension: 'HEIC', label: 'iPhone-afbeeldingen', href: '/nl/file-extensions/heic' },
    { extension: 'PDF', label: 'Documenten delen', href: '/nl/file-extensions/pdf' },
    { extension: 'DWG', label: 'CAD-tekeningen', href: '/nl/file-extensions/dwg' },
    { extension: 'DOCX', label: 'Word-documenten', href: '/nl/file-extensions/docx' },
    { extension: 'MP4', label: 'Videoformaten', href: '/nl/file-extensions/mp4' },
    { extension: 'ZIP', label: 'Archiefbestanden', href: '/nl/file-extensions/zip' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Bestandsinformatie voor iedereen</p>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Open elk bestand in seconden <span className="text-blue-600 dark:text-blue-400">met AnyFileX</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">Ontdek wat een bestand is, hoe je het opent, welke software je nodig hebt en hoe je veelvoorkomende problemen oplost.</p>
            <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
              <Link className="flex h-14 flex-1 items-center rounded-2xl border border-slate-200 bg-white px-5 text-left text-sm font-medium text-slate-400 shadow-xl shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-900" href="/nl/file-extensions">Zoek naar .heic, .dwg, Photoshop of een ander formaat...</Link>
              <Link className="flex h-14 items-center justify-center rounded-xl bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 dark:shadow-none" href="/nl/file-extensions">Zoeken</Link>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Geen account nodig · Privacyvriendelijke browsertools · Duidelijke technische uitleg</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50/50 py-12 dark:border-slate-800 dark:bg-slate-950/50"><div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">{[['Identificeer elk bestand', 'Begrijp onbekende extensies met magic bytes en headeranalyse.', '/nl/tools/file-identifier'], ['Converteer formaten', 'Ontdek veilige manieren om bestanden te converteren zonder kwaliteit te verliezen.', '/converters'], ['Herstel beschadigde bestanden', 'Volg praktische stappen voor documenten, media en archieven die niet openen.', '/troubleshoot']].map(([title, description, href]) => <Link key={title} href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p></Link>)}</div></section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Populaire formaten</p><h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Vind snel de juiste informatie</h2></div><Link className="font-bold text-blue-600 hover:underline dark:text-blue-400" href="/nl/file-extensions">Alle bestandsextensies bekijken →</Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularFormats.map((format) => <Link key={format.extension} href={format.href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 font-mono text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">.{format.extension}</span><div><h3 className="font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{format.label}</h3><p className="mt-1 text-xs text-slate-500">Technische specificaties en uitleg</p></div></div></Link>)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950" id="tools-section"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Interactieve browsertools</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Praktische hulpmiddelen voor je bestanden</h2><p className="mt-3 text-slate-600 dark:text-slate-400">Analyseer, controleer en begrijp bestanden zonder je bestanden onnodig naar een server te uploaden.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{[['Bestandsidentificatie', 'Ontdek het echte formaat met binary headers en magic bytes.', '/nl/tools/file-identifier', 'bg-emerald-50 text-emerald-600'], ['Metadata bekijken', 'Controleer EXIF-, PDF- en documenteigenschappen.', '/tools/metadata-viewer', 'bg-blue-50 text-blue-600'], ['Hash genereren', 'Maak SHA-256- en andere checksums in je browser.', '/tools/hash-generator', 'bg-violet-50 text-violet-600'], ['MIME-type controleren', 'Vergelijk Content-Type headers met het bestandstype.', '/tools/mime-checker', 'bg-amber-50 text-amber-600']].map(([title, description, href, color]) => <Link key={title} href={href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-blue-700 dark:hover:bg-slate-900"><span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black ${color}`}>X</span><h3 className="mt-4 font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p><span className="mt-5 inline-block text-xs font-bold text-blue-600 dark:text-blue-400">Open tool →</span></Link>)}</div></div></section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Waarom AnyFileX?</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Duidelijkheid voor elk digitaal bestand</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Van een onbekende download tot een beschadigd document: je krijgt betrouwbare technische context en een concrete volgende stap.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold text-slate-900 dark:text-white">Technisch onderbouwd</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">MIME-types, signatures en software-informatie worden gescheiden van de uitleg over hoe je verdergaat.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold text-slate-900 dark:text-white">Privacyvriendelijk</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Gebruik lokale analyse waar mogelijk en houd controle over gevoelige documenten en foto’s.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold text-slate-900 dark:text-white">Praktisch uitgelegd</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Geen vage foutmeldingen: duidelijke stappen voor openen, converteren en herstellen.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold text-slate-900 dark:text-white">Voor elk platform</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Handleidingen voor Windows, macOS, Linux, Android en iOS.</p></div></div></div></div></section>

      <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Laatste handleidingen</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Leer meer over bestandsformaten</h2></div><Link href="/nl/guides" className="font-bold text-blue-600 hover:underline dark:text-blue-400">Alle handleidingen →</Link></div><div className="mt-8 grid gap-5 md:grid-cols-3">{[['HEIC-bestanden openen', 'Lees hoe je HEIC-foto’s opent op Windows, Mac, Android en iPhone.', '/nl/how-to-open/heic'], ['Bestandstypen identificeren', 'Gebruik magic bytes om een onbekend bestand te controleren.', '/nl/tools/file-identifier'], ['Technische bestandsgidsen', 'Verdiep je in containers, metadata en compatibiliteit.', '/guides']].map(([title, description, href]) => <Link key={title} href={href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-700 dark:hover:bg-slate-900"><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Handleiding</span><h3 className="mt-3 font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p><span className="mt-5 inline-block text-xs font-bold text-blue-600 dark:text-blue-400">Lees meer →</span></Link>)}</div></div></section>

      <DutchNewsletter />

      <section className="border-y border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8"><div><p className="text-2xl font-extrabold text-slate-900 dark:text-white">250+</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Formaten</p></div><div><p className="text-2xl font-extrabold text-slate-900 dark:text-white">316</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Handleidingen</p></div><div><p className="text-2xl font-extrabold text-slate-900 dark:text-white">35+</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Browsertools</p></div><div><p className="text-2xl font-extrabold text-slate-900 dark:text-white">100%</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Privé en lokaal</p></div></div></section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Zo werkt het</p><h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Van onbekend bestand naar duidelijke volgende stap</h2><div className="mt-8 space-y-6">{[['01', 'Identificeer', 'Bekijk de bestandshandtekening en controleer of de extensie overeenkomt met de inhoud.'], ['02', 'Begrijp', 'Lees technische gegevens, MIME-types, compatibiliteit en mogelijke oorzaken van problemen.'], ['03', 'Handel', 'Volg een passende handleiding of gebruik een browsertool om verder te werken.']].map(([number, title, description]) => <div key={number} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">{number}</span><div><h3 className="font-bold text-slate-900 dark:text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p></div></div>)}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Privacy eerst</p><h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">Je bestanden blijven waar mogelijk op je apparaat</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Bestandsanalyse, magic-byte-controles en verschillende hulpprogramma’s werken lokaal in je browser. Zo kun je eerst technische informatie controleren voordat je een bestand met een externe dienst deelt.</p><Link className="mt-6 inline-block font-bold text-blue-600 hover:underline dark:text-blue-400" href="/nl/tools/file-identifier">Probeer lokale analyse →</Link></div></section>

      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><h2 className="text-2xl font-black text-slate-900 dark:text-white">Klaar om een bestand te onderzoeken?</h2><p className="mt-2 text-slate-600 dark:text-slate-300">Begin met een extensie, een onbekend bestand of een praktische openingshandleiding.</p></div><Link className="rounded-xl bg-blue-600 px-5 py-3 text-center font-bold text-white hover:bg-blue-700" href="/nl/tools/file-identifier">Start met AnyFileX</Link></div></section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AnyFileX',
        url: 'https://anyfilex.com/nl/',
        inLanguage: 'nl',
        description: 'Identificeer bestandsformaten, bekijk technische details en gebruik privacyvriendelijke hulpmiddelen in je browser.',
      }) }} />
    </div>
  );
}

export function DutchHeicPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Bestandsextensie .HEIC</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">HEIC-bestand openen</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
        HEIC is een afbeeldingsformaat dat vaak door iPhones en iPads wordt gebruikt. Op deze pagina ontdek je wat een HEIC-bestand is, welke technische kenmerken het heeft en hoe je het opent op Windows, Mac, Android en iPhone.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Technische gegevens</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div><dt className="font-semibold">Naam</dt><dd>{heic.name}</dd></div>
            <div><dt className="font-semibold">MIME-type</dt><dd>{heic.mimeType || 'image/heic'}</dd></div>
            <div><dt className="font-semibold">Extensie</dt><dd>.HEIC</dd></div>
          </dl>
        </section>
        <section className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">HEIC openen</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Op recente Apple-apparaten opent HEIC meestal direct in Foto’s. Op Windows kan ondersteuning of conversie nodig zijn. Controleer altijd het bestand lokaal als het om privéfoto’s gaat.</p>
          <Link className="mt-5 inline-block font-bold text-blue-600 hover:underline" href="/nl/how-to-open/heic">Bekijk de volledige handleiding →</Link>
        </section>
      </div>
      <div className="mt-12"><ExtensionDetailClient ext="heic" /></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'HEIC-bestand openen',
        description: 'Leer hoe je HEIC-bestanden opent op Windows, Mac, Android en iPhone.',
        inLanguage: 'nl',
        url: 'https://anyfilex.com/nl/file-extensions/heic',
      }) }} />
    </article>
  );
}

export function DutchFileIdentifierPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 pt-12 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Bestandsanalyse in de browser</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Onbekend bestand identificeren</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Upload een onbekend bestand om de magic bytes, het vermoedelijke formaat en de technische handtekening te controleren. De analyse gebeurt lokaal in je browser.</p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AnyFileX Bestandsidentificatie',
        description: 'Identificeer onbekende bestanden met lokale binary- en MIME-analyse in je browser.',
        url: 'https://anyfilex.com/nl/tools/file-identifier',
        inLanguage: 'nl',
      }) }} />
      <FileIdentifierRouteClient />
    </div>
  );
}

export function DutchHowToOpenHeicPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Handleiding</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Hoe open je een HEIC-bestand?</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Een HEIC-bestand is een foto in het High Efficiency Image Format. Op iPhone, iPad en Mac kun je zulke foto’s doorgaans direct openen in Foto’s of Voorvertoning.</p>
      <h2 className="mt-10 text-2xl font-bold text-slate-900 dark:text-white">Op Windows</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Als Windows je HEIC-bestand niet opent, installeer dan een betrouwbare HEIF/HEVC-extensie uit een officiële bron of zet de foto om naar een formaat dat je workflow ondersteunt. Deel geen privéfoto’s met onbekende online converters.</p>
      <h2 className="mt-10 text-2xl font-bold text-slate-900 dark:text-white">Op Android</h2>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Veel recente Android-apparaten kunnen HEIC-afbeeldingen weergeven. Werkt dat niet, gebruik dan een lokale galerij-app of converteer het bestand op je eigen apparaat.</p>
      <Link className="mt-10 inline-block font-bold text-blue-600 hover:underline" href="/nl/file-extensions/heic">Meer over de HEIC-extensie →</Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Hoe open je een HEIC-bestand?',
        description: 'Praktische uitleg voor het openen van HEIC-bestanden op Windows, Mac, Android en iPhone.',
        inLanguage: 'nl',
        url: 'https://anyfilex.com/nl/how-to-open/heic',
      }) }} />
    </article>
  );
}
