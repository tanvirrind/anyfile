import React from 'react';
import { Search, BookOpenCheck, Download, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';

export const HowItWorksSection: React.FC = () => {
  const locale = useLocale();
  const translations = locale === 'nl' ? {
    eyebrow: 'Eenvoudig proces in 3 stappen', title: 'Zo werkt AnyFileX', intro: 'Van onbekend bestand naar duidelijkheid in minder dan 5 seconden.',
    steps: [['Zoek een bestandsextensie', 'Voer bijvoorbeeld .heic, .dwg of .dat in, of sleep een onbekend bestand naar onze checker.'], ['Ontdek hoe je het opent', 'Bekijk direct de bestandsindeling, magic bytes, MIME-types, veiligheidsrisico’s en hersteltips.'], ['Gebruik aanbevolen software', 'Vind betrouwbare gratis, open source of ingebouwde apps voor Windows, macOS, Linux, iOS en Android.']],
  } : locale === 'es' ? {
    eyebrow: 'Proceso sencillo en 3 pasos', title: 'Cómo funciona AnyFileX', intro: 'Pasa de un archivo desconocido a una respuesta clara en menos de 5 segundos.',
    steps: [['Busca una extensión', 'Escribe .heic, .dwg o .dat, o arrastra tu archivo desconocido al analizador.'], ['Descubre cómo abrirlo', 'Consulta el formato, magic bytes, tipos MIME, riesgos de seguridad y pasos de reparación.'], ['Usa el software recomendado', 'Encuentra aplicaciones gratuitas, verificadas o nativas para Windows, macOS, Linux, iOS y Android.']],
  } : {
    eyebrow: 'Simple 3-Step Process', title: 'How AnyFileX Works', intro: 'From unknown file prompt to full clarity in less than 5 seconds.',
    steps: [['Search a file extension', 'Enter any extension like .heic, .dwg, or .dat into the search box, or drop your unknown file directly onto our inspector.'], ['Learn how to open it', 'Get immediate answers about the format, magic byte signatures, MIME types, danger/security rating, and repair walkthroughs.'], ['Use recommended software', 'Download verified free, open-source, or native software for Windows, macOS, Linux, iOS, and Android to open or convert the file.']],
  };
  const steps = [
    {
      stepNumber: '1',
      title: translations.steps[0][0],
      description: translations.steps[0][1],
      icon: Search,
      badgeColor: 'bg-blue-600 text-white',
      accentBorder: 'border-blue-500',
    },
    {
      stepNumber: '2',
      title: translations.steps[1][0],
      description: translations.steps[1][1],
      icon: BookOpenCheck,
      badgeColor: 'bg-emerald-600 text-white',
      accentBorder: 'border-emerald-500',
    },
    {
      stepNumber: '3',
      title: translations.steps[2][0],
      description: translations.steps[2][1],
      icon: Download,
      badgeColor: 'bg-violet-600 text-white',
      accentBorder: 'border-violet-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {translations.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
            {translations.title}
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            {translations.intro}
          </p>
        </div>

        {/* 3 Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 relative flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all"
                id={`how-it-works-step-${step.stepNumber}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-10 h-10 rounded-xl ${step.badgeColor} font-heading font-extrabold text-lg flex items-center justify-center shadow-md`}>
                      {step.stepNumber}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
