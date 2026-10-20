'use client';

import React from 'react';
import { useLocale } from 'next-intl';

// Every figure below is counted from the site's own registries:
// 354 = EXTENSION_INDEX records in src/lib/database/extensionEngine.ts
// 82  = DB_SIGNATURES in src/lib/analyzer/signatureIndex.ts
// 24  = GUIDES_LIST (src/data/guidesData.ts) + published INITIAL_CONTENT_ENTITIES (src/lib/content/contentRegistry.ts)
// 48  = TOOLS_REGISTRY in src/lib/tools/toolsRegistry.ts
// 28  = CONVERTERS_LIST in src/data/convertersData.ts
export const SocialProofSection: React.FC = () => {
  const locale = useLocale();

  const labels = locale === 'nl' ? ['Doorzoekbare formaten', 'Gepubliceerde handleidingen', 'Browsertools', 'Privé en lokaal'] : locale === 'es' ? ['Formatos buscables', 'Guías publicadas', 'Herramientas web', 'Privado y local'] : ['Searchable Formats', 'Published Guides', 'In-Browser Tools', 'Private & Local'];
  const subtexts = locale === 'nl'
    ? ['82 geverifieerde byte-handtekeningprofielen', 'Handleidingen voor openen, herstel en vergelijking', 'Inclusief 28 formaatconverters', 'Geen serveruploads • Verwerking in het geheugen']
    : locale === 'es'
      ? ['82 perfiles de firmas de bytes verificadas', 'Guías para abrir, reparar y comparar', 'Incluye 28 convertidores de formato', 'Sin subidas al servidor • Procesamiento en memoria']
      : ['82 verified byte-signature profiles', 'Opening, repair & comparison manuals', 'Includes 28 format converters', 'Zero server uploads • In-memory processing'];
  const stats = [
    {
      value: '354',
      label: labels[0],
      subtext: subtexts[0],
      id: 'stat-formats',
    },
    {
      value: '24',
      label: labels[1],
      subtext: subtexts[1],
      id: 'stat-guides',
    },
    {
      value: '48',
      label: labels[2],
      subtext: subtexts[2],
      id: 'stat-tools',
    },
    {
      value: '100%',
      label: labels[3],
      subtext: subtexts[3],
      id: 'stat-privacy',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-950 py-6 border-y border-slate-200/60 dark:border-slate-800/60" id="platform-metrics-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-start">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group" id={stat.id}>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
