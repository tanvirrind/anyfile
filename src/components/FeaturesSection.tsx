import React from 'react';
import { Search, RefreshCw, Wrench } from 'lucide-react';
import { useLocale } from 'next-intl';

interface FeaturesSectionProps {
  onSelectFeatureTab?: (tab: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeatureTab }) => {
  const locale = useLocale();
  const translations = locale === 'nl' ? [
    ['Identificeer elk bestand', 'Begrijp onbekende bestandsextensies met magic bytes en ruwe headeranalyse.'],
    ['Converteer formaten', 'Leer bestanden veilig converteren zonder kwaliteitsverlies met ingebouwde browserconverters.'],
    ['Herstel beschadigde bestanden', 'Volg praktische stappen om beschadigde documenten, media en archieven te herstellen.'],
  ] : locale === 'es' ? [
    ['Identifica cualquier archivo', 'Comprende extensiones desconocidas mediante magic bytes y el análisis de cabeceras.'],
    ['Convierte formatos', 'Aprende a convertir archivos de forma segura y sin perder calidad con herramientas web.'],
    ['Repara archivos dañados', 'Sigue pasos prácticos para reparar documentos, archivos multimedia y comprimidos.'],
  ] : [
    ['Identify Any File', 'Quickly understand unknown file extensions with magic bytes and raw header inspection.'],
    ['Convert Formats', 'Learn how to convert files safely without losing quality using built-in web converters.'],
    ['Repair Corrupt Files', 'Step-by-step guides to fixing broken documents, media headers, and unreadable archives.'],
  ];
  const features = [
    {
      id: 'identify',
      title: translations[0][0],
      description: translations[0][1],
      icon: Search,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'convert',
      title: translations[1][0],
      description: translations[1][1],
      icon: RefreshCw,
      iconBg: 'bg-blue-50 dark:bg-blue-950/60',
      iconColor: 'text-blue-500',
    },
    {
      id: 'repair',
      title: translations[2][0],
      description: translations[2][1],
      icon: Wrench,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200/60 dark:border-slate-800/60" id="features">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">{locale === 'nl' ? 'Wat je met AnyFileX kunt doen' : locale === 'es' ? 'Qué puedes hacer con AnyFileX' : 'What You Can Do with AnyFileX'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => onSelectFeatureTab?.(feature.id)}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                id={`feature-card-${feature.id}`}
              >
                <div>
                  <div className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-base">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
