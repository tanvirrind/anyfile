import React from 'react';
import { Search, RefreshCw, Wrench } from 'lucide-react';

interface FeaturesSectionProps {
  onSelectFeatureTab?: (tab: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeatureTab }) => {
  const features = [
    {
      id: 'identify',
      title: 'Identify Any File',
      description: 'Quickly understand unknown file extensions with magic bytes and raw header inspection.',
      icon: Search,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      iconColor: 'text-emerald-500',
    },
    {
      id: 'convert',
      title: 'Convert Formats',
      description: 'Learn how to convert files safely without losing quality using built-in web converters.',
      icon: RefreshCw,
      iconBg: 'bg-blue-50 dark:bg-blue-950/60',
      iconColor: 'text-blue-500',
    },
    {
      id: 'repair',
      title: 'Repair Corrupt Files',
      description: 'Step-by-step guides to fixing broken documents, media headers, and unreadable archives.',
      icon: Wrench,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200/60 dark:border-slate-800/60" id="features">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">What You Can Do with AnyFileX</h2>
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
