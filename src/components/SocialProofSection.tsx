'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export const SocialProofSection: React.FC = () => {
  const locale = useLocale();
  const [showMethodology, setShowMethodology] = useState(false);

  const labels = locale === 'nl' ? ['Doorzoekbare formaten', 'Geverifieerde handleidingen', 'Browsertools', 'Privé en lokaal'] : locale === 'es' ? ['Formatos buscables', 'Guías verificadas', 'Herramientas web', 'Privado y local'] : ['Searchable Formats', 'Verified Guides', 'In-Browser Tools', 'Private & Local'];
  const subtexts = locale === 'nl'
    ? ['43 byte-handtekeningprofielen • 250+ geïndexeerd', 'Handleidingen voor openen, herstel en vergelijking', '26 forensische functies • 9 converters', 'Geen serveruploads • WASM in geheugen']
    : locale === 'es'
      ? ['43 perfiles de firmas • más de 250 indexados', 'Guías para abrir, reparar y comparar', '26 utilidades forenses • 9 convertidores', 'Sin subidas al servidor • WASM en memoria']
      : ['43 byte-signature profiles • 250+ indexed', 'Opening, repair & comparison manuals', '26 forensic utilities • 9 converters', 'Zero server uploads • In-memory WASM'];
  const stats = [
    {
      value: '250+',
      label: labels[0],
      subtext: subtexts[0],
      id: 'stat-formats',
    },
    {
      value: '316',
      label: labels[1],
      subtext: subtexts[1],
      id: 'stat-guides',
    },
    {
      value: '35+',
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

        {/* Transparency & Methodology Anchor */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setShowMethodology(true)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
            id="open-metrics-methodology-btn"
          >
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span className="underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2">
              {locale === 'nl' ? 'Rapport over onderbouwing en afstemming van statistieken' : locale === 'es' ? 'Informe de verificación y conciliación de métricas' : 'Metrics Substantiation & Discrepancy Reconciliation Report'}
            </span>
          </button>
        </div>
      </div>

      {/* Methodology & Reconciliation Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            id="metrics-methodology-modal"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'es' ? 'Transparencia radical e integridad de datos' : 'Radical Transparency & Data Integrity'}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {locale === 'es' ? 'Conciliación y auditoría de métricas de la plataforma' : 'Platform Metrics Reconciliation & Audit'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMethodology(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="close-metrics-methodology-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {locale === 'es' ? 'En AnyFileX aplicamos rigor editorial y trazabilidad. A continuación presentamos la conciliación formal de las afirmaciones históricas, las cifras de indexación y las métricas de contenido publicadas:' : 'At AnyFileX, we enforce rigorous editorial honesty and auditability. Below is our formal reconciliation of all historical claims, indexing figures, and published content metrics:'}
            </p>

            {/* Reconciliation Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">{locale === 'es' ? 'Métrica declarada' : 'Claimed Metric'}</th>
                    <th className="p-3">{locale === 'es' ? 'Realidad verificada' : 'Verified Reality'}</th>
                    <th className="p-3">{locale === 'es' ? 'Metodología de verificación y conciliación' : 'Substantiation & Reconciliation Methodology'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {locale === 'es' ? '“Más de 250 tipos” frente a “más de 50.000 extensiones”' : '"250+ file types" vs "50,000+ extensions"'}
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {locale === 'es' ? 'Más de 250 catalogados (43 perfiles de firmas)' : '250+ cataloged (43 byte-signature profiles)'}
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      {locale === 'es' ? 'Los índices de terceros que afirman ofrecer “más de 50.000 extensiones” suelen recopilar secuencias aleatorias, extensiones con errores tipográficos y archivos temporales. AnyFileX indexa más de 250 extensiones digitales legítimas a partir de registros de IANA, ISO, RFC y estándares de software, respaldadas por 43 perfiles detallados con magic bytes y firmas de desplazamiento verificadas.' : 'Third-party search indexes claiming "50,000+ extensions" scrape non-standard random character sequences, typo extensions, and temporary file artifacts. AnyFileX indexes strictly legitimate digital extensions across 250+ searchable records (derived from IANA, ISO, RFC, and software standards registries), anchored by 43 deep, manually authored profiles with verified magic bytes and offset signatures.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {locale === 'es' ? '“Más de 500 guías”' : '"500+ guides"'}
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {locale === 'es' ? '316 guías revisadas por pares' : '316 peer-reviewed guides'}
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      {locale === 'es' ? <>Las estimaciones anteriores se redondearon a “más de 500”. El inventario real contiene <strong>316 guías publicadas y verificadas</strong>: 254 manuales para abrir formatos en distintos sistemas, 32 matrices comparativas, 13 manuales de reparación y 17 especificaciones técnicas de seguridad forense. No generamos artículos superficiales automáticamente para inflar las cifras.</> : 'Earlier marketing estimates rounded up to "500+". The actual codebase inventory contains 316 published, verified guides: 254 format-specific OS opening manuals, 32 pairwise format comparison matrices, 13 corrupted file repair manuals, and 17 technical authority & forensic security specifications. We reject auto-generating thin filler articles simply to inflate numbers.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {locale === 'es' ? '“Más de 100 herramientas”' : '"100+ tools"'}
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {locale === 'es' ? 'Más de 35 utilidades verificadas' : '35+ verified utilities'}
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      {locale === 'es' ? <>Muchos sitios cuentan cada combinación (por ejemplo, PNG a JPG y JPG a PNG) como una herramienta distinta. AnyFileX ofrece <strong>26 utilidades de análisis binario y forense</strong> más <strong>9 convertidores WebAssembly en memoria</strong> (más de 35 en total), todos ejecutados localmente en el navegador.</> : 'Many conversion sites claim "100+ tools" by counting every permutation (e.g., PNG to JPG, JPG to PNG) as a distinct tool. AnyFileX provides 26 dedicated binary analysis/forensic utilities plus 9 in-memory WebAssembly converters (35+ total), each running 100% locally in browser memory.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {locale === 'es' ? '“Más de 25.000 suscriptores”' : '"25,000+ subscribers"'}
                    </td>
                    <td className="p-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {locale === 'es' ? 'Sin contadores inflados' : 'Zero Vanity Counters'}
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">
                      {locale === 'es' ? 'Hemos eliminado todas las métricas no verificadas sobre “más de 25.000 suscriptores”. Nuestro boletín técnico mensual es voluntario y está dirigido a arquitectos de sistemas, archivistas digitales e investigadores de seguridad, sin cifras infladas.' : 'Any unverified vanity metrics referencing "25,000+ subscribers" have been completely removed. Our monthly technical circular is strictly opt-in, focused on system architects, digital archivists, and security researchers, without artificially inflated vanity subscriber badges.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {locale === 'es' ? 'Todas las estadísticas de AnyFileX están vinculadas mediante programación a nuestro registro de contenido y modelos de datos abiertos. Actualizamos estas cifras en tiempo real cuando nuestro comité editorial valida nuevos formatos.' : 'All platform statistics displayed across AnyFileX are programmatically linked to our open Content Registry and Data Models. We update these figures in real-time as new formats are vetted by our editorial board.'}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMethodology(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
                id="confirm-methodology-btn"
              >
                {locale === 'es' ? 'Cerrar informe de auditoría' : 'Close Audit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
