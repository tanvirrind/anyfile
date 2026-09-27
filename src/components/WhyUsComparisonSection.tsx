import React from 'react';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';

export const WhyUsComparisonSection: React.FC = () => {
  const locale = useLocale();
  const translations = locale === 'nl' ? {
    eyebrow: 'Waarom voor ons kiezen', title: 'AnyFileX versus algemene zoekmachines', intro: 'Vind snel duidelijke antwoorden zonder misleidende advertenties of onbetrouwbare downloads.', columns: ['Functie / criterium', 'Algemeen zoeken'],
    items: [['Snelle, directe antwoorden', 'Directe formaatinformatie', 'Verspreide links en advertenties'], ['Duidelijke uitleg voor beginners', 'Stappen in begrijpelijke taal', 'Onduidelijk technisch jargon'], ['Betrouwbare softwaretips', 'Gratis, open source en ingebouwde apps', 'Risico op onveilige installers'], ['Conversiehandleidingen in je browser', 'Tools zonder installatie', 'Betaalde converters met watermerk'], ['Herstel van headers en beschadigde bestanden', 'Uitgebreide herstelstappen', 'Verouderde forumdiscussies'], ['Veiligheids- en risicoanalyse', 'Waarschuwingen voor macro’s en uitvoerbare bestanden', 'Geen duidelijke veiligheidswaarschuwingen']],
  } : locale === 'es' ? {
    eyebrow: 'Por qué elegirnos', title: 'AnyFileX frente a los buscadores genéricos', intro: 'Encuentra respuestas técnicas claras sin anuncios engañosos ni descargas dudosas.', columns: ['Función / criterio', 'Búsqueda genérica'],
    items: [['Respuestas rápidas y directas', 'Ficha técnica inmediata', 'Enlaces mezclados y anuncios'], ['Explicaciones claras para principiantes', 'Pasos en lenguaje sencillo', 'Jerga técnica difícil'], ['Recomendaciones de software verificadas', 'Aplicaciones gratuitas, nativas y de código abierto', 'Riesgo de instaladores inseguros'], ['Guías de conversión en el navegador', 'Herramientas sin instalación', 'Conversores de pago con marcas de agua'], ['Reparación de cabeceras y archivos dañados', 'Pasos detallados de recuperación', 'Foros desactualizados'], ['Evaluación de seguridad y riesgos', 'Avisos sobre macros y ejecutables', 'Sin advertencias de seguridad']],
  } : {
    eyebrow: 'Why Choose Us', title: 'AnyFileX vs. Generic Search Engines', intro: 'Stop wading through endless ads and sketchy file viewer registry downloads. Open any file in seconds with AnyFileX.', columns: ['Feature / Criteria', 'Generic Search'],
    items: [['Fast, Direct Answers', '<10ms instant format card', 'Mixed forum links & ad portals'], ['Beginner Friendly Explanations', 'Plain language step-by-step', 'Obscure technical developer jargon'], ['Verified Software Recommendations', 'Free, open-source & native apps', 'Risk of ad-bloated malware installers'], ['In-Browser Conversion Guides', 'Lossless zero-install tools', 'Paid watermarked conversion sites'], ['Header Repair & Corrupt File Walkthroughs', 'Comprehensive recovery steps', 'Outdated abandoned forum threads'], ['Security & Risk Assessment', 'Macro & executable threat rating', 'No safety or virus warnings']],
  };
  const comparisonItems = translations.items.map(([feature, anyFileXNote, genericNote]) => ({ feature, anyFileXNote, genericNote, anyFileX: true, genericSearch: false }));
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/60" id="why-us-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{translations.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            {translations.title}
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            {translations.intro}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-100/80 dark:bg-slate-900/80 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 text-xs font-heading font-bold uppercase tracking-wider">
            <div className="col-span-5 text-slate-700 dark:text-slate-300">{translations.columns[0]}</div>
            <div className="col-span-4 text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>AnyFileX</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="col-span-3 text-slate-600 dark:text-slate-400">{translations.columns[1]}</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {comparisonItems.map((item, idx) => (
              <div
                key={item.feature}
                className="grid grid-cols-12 p-4 sm:p-6 items-center text-xs sm:text-sm hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                id={`comparison-row-${idx}`}
              >
                <div className="col-span-5 font-semibold text-slate-900 dark:text-white pr-2">
                  {item.feature}
                </div>

                <div className="col-span-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium pr-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs">{item.anyFileXNote}</span>
                </div>

                <div className="col-span-3 flex items-center gap-2 text-rose-500 dark:text-rose-400 font-normal">
                  <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">{item.genericNote}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
