import React from 'react';
import { BookOpen, Clock, ArrowRight, User, Sparkles } from 'lucide-react';
import { GuideInfo } from '../types';
import { GUIDES_DATA } from '../data/guidesData';
import { useLocale } from 'next-intl';

interface LatestGuidesSectionProps {
  onSelectGuide: (guide: GuideInfo) => void;
}

const SPANISH_GUIDE_COPY: Record<string, { title: string; summary: string; category: string }> = {
  'heic-guide': { title: 'Guía definitiva para abrir y convertir archivos HEIC en Windows 11 y Mac', summary: 'Aprende a abrir, ver, convertir por lotes y solucionar problemas de fotos HEIC de Apple en PC, Mac, Linux y Android.', category: 'Fotografía' },
  'dwg-guide': { title: 'Cómo ver, editar y convertir dibujos DWG de AutoCAD sin AutoCAD', summary: 'Guía para inspeccionar planos DWG binarios, convertir dibujos CAD a PDF vectorial y reparar tablas dañadas.', category: 'CAD' },
  'zip-guide': { title: 'Cómo abrir, reparar y extraer archivos ZIP dañados', summary: 'Diagnostica archivos ZIP corruptos, valida sus cabeceras y recupera datos con herramientas seguras del navegador.', category: 'Archivos' },
  'magic-bytes-explained': { title: 'Magic bytes: cómo se identifica realmente un formato de archivo', summary: 'Comprende cómo las firmas binarias revelan el formato real de un archivo aunque su extensión haya sido modificada.', category: 'Seguridad' },
  'next-gen-image-codecs': { title: 'HEIC, WebP y AVIF: comparación de formatos de imagen modernos', summary: 'Compara compresión, calidad, compatibilidad y mejores usos de los principales formatos de imagen web.', category: 'Imágenes' },
  'how-to-open-unknown-files': { title: 'Qué hacer cuando no puedes abrir un archivo desconocido', summary: 'Sigue un proceso práctico para identificar extensiones desconocidas, comprobar firmas y encontrar software compatible.', category: 'Solución de problemas' },
};

export const LatestGuidesSection: React.FC<LatestGuidesSectionProps> = ({ onSelectGuide }) => {
  const locale = useLocale();
  const copy = locale === 'nl' ? { label: 'Kennisbank en handleidingen', title: 'Nieuwste technische handleidingen', description: 'Uitgebreide stapsgewijze uitleg, beoordeeld op technische nauwkeurigheid.', read: 'Handleiding lezen' } : locale === 'es' ? { label: 'Base de conocimiento y tutoriales', title: 'Últimas guías técnicas', description: 'Guías paso a paso, revisadas para garantizar su precisión técnica.', read: 'Leer guía' } : { label: 'Knowledge Base & Tutorials', title: 'Latest Technical Guides', description: 'Comprehensive step-by-step walkthroughs authored by credentialed systems architects and digital media engineers, peer-reviewed for technical accuracy.', read: 'Read Guide' };
  const formatReadTime = (value: string) => locale === 'nl'
    ? value.replace(/\s*min\s*read/i, ' min lezen')
    : locale === 'es'
      ? value.replace(/\s*min\s*read/i, ' min de lectura')
      : value;
  const formatDate = (value: string) => locale === 'es'
    ? value.replace('January', 'enero').replace('February', 'febrero').replace('March', 'marzo').replace('April', 'abril').replace('May', 'mayo').replace('June', 'junio').replace('July', 'julio').replace('August', 'agosto').replace('September', 'septiembre').replace('October', 'octubre').replace('November', 'noviembre').replace('December', 'diciembre')
    : value;
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60" id="guides-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{copy.label}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {copy.title}
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              {copy.description}
            </p>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES_DATA.map((guide) => (
            (() => {
              const localizedGuide = locale === 'es' ? { ...guide, ...SPANISH_GUIDE_COPY[guide.id] } : guide;
              return (
            <div
              key={guide.id}
              onClick={() => onSelectGuide(guide)}
              className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              id={`guide-card-${guide.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                    {localizedGuide.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatReadTime(guide.readTime)}</span>
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {localizedGuide.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {localizedGuide.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={guide.author.avatar}
                    alt={guide.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{guide.author.name}</span>
                      {guide.author.credentials && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-mono font-medium">
                          {guide.author.credentials}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400">{formatDate(guide.date)}</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>{copy.read}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
};
