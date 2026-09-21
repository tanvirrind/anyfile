import React from 'react';
import { Layers, FileCode, AppWindow, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CATEGORIES_LIST } from '../data/categoriesData';
import { getAllFileTypeInfos } from '../lib/database/extensionEngine';
import { SOFTWARE_LIST } from '../data/softwareData';
import { AppRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { FAQAccordion } from '../components/FAQAccordion';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';
import { generateFAQSchema } from '../lib/seo/faqGenerator';

interface CategoryPageProps {
  categoryId: string;
  onNavigate: (route: AppRoute) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, onNavigate }) => {
  const category = CATEGORIES_LIST.find((c) => c.id === categoryId) || CATEGORIES_LIST[0];

  // Matching extensions
  const matchingExts = getAllFileTypeInfos().filter(
    (item) => category.popularExtensions.includes(item.extension) || item.category.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
  );

  // Matching software
  const matchingSoftware = SOFTWARE_LIST.filter(
    (s) => category.topSoftware.includes(s.name) || s.category.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
  );

  const canonicalPath = `/category/${category.id}`;
  const categoryFaqs = category.faqs || [
    {
      question: `What are ${category.name} file extensions?`,
      answer: category.description,
    },
    {
      question: `How do I open ${category.name} files?`,
      answer: `To open ${category.name} files, use compatible applications like ${category.topSoftware.join(', ')} or AnyFileX's free file identifier tool.`,
    },
  ];

  const categorySchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `https://www.anyfilex.com${canonicalPath}#collection`,
        url: `https://www.anyfilex.com${canonicalPath}`,
        name: `${category.name} File Extensions & Software Specifications`,
        description: category.description,
      },
      generateFAQSchema(categoryFaqs),
    ],
  };

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <SEOHead
        title={`${category.name} File Formats & Opening Software`}
        description={category.description}
        canonicalPath={canonicalPath}
        schemaData={categorySchema}
      />

      <Breadcrumb
        items={[
          { label: 'Categories', route: { view: 'extensions' } },
          { label: category.name },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <Badge variant="blue" size="md">Format Category</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {category.name}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {category.description}
        </p>
      </div>

      {/* Popular Extensions Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-600" />
          <span>Popular {category.name} Extensions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingExts.map((item) => (
            <div
              key={item.extension}
              onClick={() => onNavigate({ view: 'extension-detail', ext: item.extension })}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-xl">
                    .{item.extension}
                  </span>
                  <Badge variant="slate">{item.category}</Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Software Grid */}
      {matchingSoftware.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AppWindow className="w-5 h-5 text-emerald-600" />
            <span>Top Software for {category.name}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingSoftware.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate({ view: 'software-detail', id: item.id })}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-400">{item.developer} • {item.priceText}</div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600">
                  <span>View Software</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category FAQs */}
      <FAQAccordion faqs={categoryFaqs} />

      {/* Explore Other Categories Interlinking */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span>Explore File Format Categories</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate({ view: 'category-detail', id: cat.id })}
              className={`p-3 rounded-2xl border text-left font-semibold transition-all flex items-center justify-between cursor-pointer ${
                cat.id === category.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700/80 hover:border-blue-500 hover:text-blue-300 text-slate-300'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
