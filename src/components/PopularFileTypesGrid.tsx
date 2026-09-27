'use client';

import React, { useState } from 'react';
import { ArrowRight, Layers, ShieldCheck, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { FileTypeInfo } from '../types';
import { POPULAR_FILE_TYPES } from '../data/fileTypesData';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface PopularFileTypesGridProps {
  onSelectExtension: (ext: string) => void;
}

const SPANISH_FILE_TYPE_COPY: Record<string, { name: string; category: string; description: string }> = {
  HEIC: { name: 'Contenedor de imágenes de alta eficiencia', category: 'Imágenes', description: 'Formato de cámara de alta eficiencia de Apple que utiliza compresión HEVC.' },
  PSD: { name: 'Documento de Adobe Photoshop', category: 'Imágenes', description: 'Archivo de proyecto gráfico por capas creado en Adobe Photoshop.' },
  WEBP: { name: 'Formato de imagen WebP de Google', category: 'Imágenes', description: 'Formato de imagen web moderno desarrollado por Google con compresión avanzada.' },
  SVG: { name: 'Gráficos vectoriales escalables', category: 'Imágenes', description: 'Formato vectorial basado en XML que se escala sin perder resolución.' },
  TIFF: { name: 'Formato de archivo de imagen etiquetado', category: 'Imágenes', description: 'Formato de gráficos rasterizados de alta calidad para impresión y fotografía.' },
  CR3: { name: 'Imagen RAW Canon versión 3', category: 'Imágenes', description: 'Formato de datos RAW sin procesar creado por cámaras digitales Canon EOS.' },
  DWG: { name: 'Base de datos de dibujos de AutoCAD', category: 'CAD y 3D', description: 'Formato CAD binario estándar para diseños arquitectónicos y de ingeniería en 2D y 3D.' },
  STEP: { name: 'Modelo CAD ISO 10303 STEP', category: 'CAD y 3D', description: 'Formato universal de intercambio CAD para geometría sólida y estructuras de ensamblaje.' },
  STL: { name: 'Malla 3D de estereolitografía', category: 'CAD y 3D', description: 'Formato de malla de superficie 3D compuesto por facetas triangulares para impresión 3D.' },
  BLEND: { name: 'Archivo de escena 3D de Blender', category: 'CAD y 3D', description: 'Escena completa de animación 3D con mallas, rigging, sombreadores y fotogramas clave.' },
  PDF: { name: 'Formato de documento portátil', category: 'Documentos', description: 'Formato universal que conserva fuentes, diseño y maquetación vectorial.' },
  DOCX: { name: 'Documento XML abierto de Microsoft Word', category: 'Documentos', description: 'Formato de documento XML comprimido creado por Microsoft Word.' },
  XLSX: { name: 'Hoja de cálculo XML abierto de Microsoft Excel', category: 'Documentos', description: 'Formato de hoja de cálculo XML comprimido creado por Microsoft Excel.' },
  EPUB: { name: 'Libro electrónico de publicación electrónica', category: 'Documentos', description: 'Formato abierto de libro electrónico con tipografía adaptable y estructura XHTML.' },
  ZIP: { name: 'Archivo comprimido ZIP', category: 'Archivos', description: 'Formato universal de compresión sin pérdida y contenedor de archivos.' },
  RAR: { name: 'Archivo comprimido Roshal', category: 'Archivos', description: 'Formato propietario de archivos comprimidos creado por Eugene Roshal.' },
  '7Z': { name: 'Archivo comprimido 7-Zip', category: 'Archivos', description: 'Formato de código abierto con compresión LZMA y LZMA2 de alta eficiencia.' },
  AWBS: { name: 'Archivo de datos del sistema AWBS', category: 'Bases de datos', description: 'Archivo especializado para datos de peso, equilibrio y carga de aeronaves.' },
  CAMREC: { name: 'Grabación de pantalla de Camtasia', category: 'Audio y vídeo', description: 'Contenedor de grabación de pantalla utilizado por versiones antiguas de Camtasia.' },
  MOV: { name: 'Película QuickTime', category: 'Audio y vídeo', description: 'Contenedor multimedia de Apple para vídeo, audio, subtítulos y metadatos.' },
};

export const PopularFileTypesGrid: React.FC<PopularFileTypesGridProps> = ({ onSelectExtension }) => {
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = locale === 'nl' ? ['Alles', 'Afbeeldingen', 'CAD en 3D', 'Documenten', 'Archieven', 'Code en data'] : locale === 'es' ? ['Todo', 'Imágenes', 'CAD y 3D', 'Documentos', 'Archivos', 'Código y datos'] : ['All', 'Images', 'CAD & 3D', 'Documents', 'Archives', 'Code & Data'];
  const categoryKeys = ['All', 'Images', 'CAD & 3D', 'Documents', 'Archives', 'Code & Data'];
  const copy = locale === 'nl' ? { directory: 'Bestandsformaatgids', title: 'Populaire bestandsextensies', intro: 'Bekijk software, uitleg voor het openen en veiligheidstips voor elk bestandsformaat.', software: 'Aanbevolen software', open: 'Openen' } : locale === 'es' ? { directory: 'Formatos de archivo', title: 'Extensiones populares', intro: 'Consulta software compatible, guías para abrir archivos y recomendaciones de seguridad.', software: 'Software recomendado', open: 'Abrir' } : { directory: 'Format Directory', title: 'Popular File Extensions', intro: 'Click any extension card to inspect software options, step-by-step opening guides, and safety checks.', software: 'Primary Software', open: 'Open' };

  const activeCategoryKey = categoryKeys[categories.indexOf(activeCategory)] ?? 'All';
  const filteredItems = activeCategoryKey === 'All'
    ? POPULAR_FILE_TYPES
    : POPULAR_FILE_TYPES.filter((item) => item.category === activeCategoryKey);

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60" id="popular-extensions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{copy.directory}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
              {copy.title}
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-xl">
              {copy.intro}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Extensions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const localizedItem = locale === 'es' ? { ...item, ...SPANISH_FILE_TYPE_COPY[item.extension] } : item;
            const topApp = item.popularApps[0]?.name || item.exampleUse;
            return (
              <div
                key={item.extension}
                onClick={() => onSelectExtension(item.extension)}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                id={`file-type-card-${item.extension.toLowerCase()}`}
              >
                <div>
                  {/* Extension Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-extrabold text-lg px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      .{item.extension}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {localizedItem.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {localizedItem.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {localizedItem.description}
                  </p>
                </div>

                {/* Footer Section with Example App & Open CTA */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
                      {copy.software}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                      {topApp}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExtension(item.extension);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                  >
                    <span>{copy.open}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {locale === 'es' && <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/70 p-6 dark:border-blue-900/60 dark:bg-blue-950/30">
          <h3 className="font-bold text-slate-900 dark:text-white">Convertidores populares</h3>
          <div className="mt-3 flex flex-wrap gap-3">{[
            ['Convertir HEIC a JPG', '/es/convertir/heic-a-jpg'],
            ['Convertir WebP a JPG', '/es/convertir/webp-a-jpg'],
            ['Convertir PDF a JPG', '/es/convertir/pdf-a-jpg'],
            ['Convertir PDF a PNG', '/es/convertir/pdf-a-png'],
            ['Convertir JPG a PDF', '/es/convertir/jpg-a-pdf'],
            ['Convertir PNG a PDF', '/es/convertir/png-a-pdf'],
            ['Convertir HEIC a PDF', '/es/convertir/heic-a-pdf'],
          ].map(([label, href]) => <Link key={href} href={href} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:text-blue-900 dark:bg-slate-900 dark:text-blue-300">{label}</Link>)}</div>
        </div>}
      </div>
    </section>
  );
};
