import Link from 'next/link';
import { ConvertersClient } from '@/components/routes/RouteClients';

const conversions = {
  'heic-a-jpg': {
    id: 'heic-to-jpg', from: 'HEIC', to: 'JPG', keyword: 'convertir HEIC a JPG',
    title: 'Convertir HEIC a JPG online gratis', description: 'Convierte fotos HEIC de iPhone a JPG para abrirlas, compartirlas y usarlas en cualquier dispositivo. El procesamiento se realiza en tu navegador.',
    why: 'HEIC ahorra espacio en iPhone, pero algunos sitios web, formularios y aplicaciones antiguas no aceptan este formato. JPG ofrece una compatibilidad más amplia.',
    faq: [['¿Cómo convierto una foto HEIC a JPG?', 'Selecciona tu archivo HEIC en el conversor de esta página. Cuando termine el procesamiento, descarga la imagen JPG en tu dispositivo.'], ['¿Se suben mis fotos a un servidor?', 'No. La conversión compatible se ejecuta localmente en el navegador; tus fotos no se envían a un servidor de AnyFileX.'], ['¿Pierde calidad la foto?', 'JPG vuelve a codificar la imagen y puede perder algo de información. Usa el ajuste de calidad del conversor y conserva el HEIC original si necesitas la máxima fidelidad.']],
    related: ['webp-a-jpg', 'heic-a-png', 'jpg-a-pdf'],
  },
  'webp-a-jpg': {
    id: 'webp-to-jpg', from: 'WEBP', to: 'JPG', keyword: 'convertir WebP a JPG',
    title: 'Convertir WebP a JPG online gratis', description: 'Transforma imágenes WEBP en JPG para abrirlas en editores, adjuntarlas a formularios y compartirlas con aplicaciones que no aceptan WebP.',
    why: 'WebP es habitual en sitios web, pero algunos programas de escritorio y servicios todavía esperan JPG. La conversión se hace localmente en el navegador.',
    faq: [['¿Cómo convierto WebP a JPG?', 'Elige una o varias imágenes WEBP en el conversor. Descarga los archivos JPG generados cuando finalice el proceso.'], ['¿Qué ocurre con la transparencia?', 'JPG no admite transparencia. Las zonas transparentes necesitan un fondo sólido; revisa el resultado antes de compartirlo.'], ['¿Mis imágenes se cargan a internet?', 'No. El navegador procesa las imágenes en tu dispositivo y AnyFileX no recibe los archivos.']],
    related: ['heic-a-jpg', 'png-a-pdf', 'jpg-a-pdf'],
  },
  'pdf-a-jpg': {
    id: 'pdf-to-jpg', from: 'PDF', to: 'JPG', keyword: 'convertir PDF a JPG',
    title: 'Convertir PDF a JPG online', description: 'Convierte las páginas de un PDF en imágenes JPG para crear vistas previas, compartir páginas o reutilizar gráficos en otros documentos.',
    why: 'Una imagen JPG resulta práctica para compartir una página como imagen. Al convertir, el texto y los gráficos vectoriales pasan a píxeles; conserva el PDF si necesitas texto seleccionable.',
    faq: [['¿Cada página se convierte en un JPG?', 'Sí. Las páginas del PDF se procesan como imágenes independientes para que puedas descargarlas.'], ['¿Puedo convertir un PDF confidencial?', 'El procesamiento se realiza localmente en el navegador cuando el formato es compatible; el documento no se envía a un servidor de AnyFileX.'], ['¿El texto seguirá siendo seleccionable?', 'No. En el JPG, el texto de la página se convierte en píxeles. Conserva el PDF original para buscar o copiar texto.']],
    related: ['jpg-a-pdf', 'png-a-pdf', 'heic-a-jpg'],
  },
  'jpg-a-pdf': {
    id: 'jpg-to-pdf', from: 'JPG', to: 'PDF', keyword: 'convertir JPG a PDF',
    title: 'Convertir JPG a PDF online', description: 'Convierte imágenes JPG en un documento PDF para enviar, archivar o imprimir tus fotos y documentos escaneados.',
    why: 'PDF es más cómodo para enviar e imprimir documentos de varias páginas. Comprueba el orden y la orientación de las imágenes antes de descargar el archivo.',
    faq: [['¿Puedo incluir varias imágenes JPG?', 'El conversor admite procesamiento por lotes. Añade las imágenes y revisa el resultado generado antes de compartirlo.'], ['¿Se envían mis fotos a un servidor?', 'No. La creación del PDF compatible se realiza en el navegador y tus imágenes permanecen en tu dispositivo.'], ['¿La calidad original se conserva?', 'El PDF incorpora las imágenes seleccionadas. La nitidez final depende de la resolución y calidad de los JPG originales.']],
    related: ['png-a-pdf', 'pdf-a-jpg', 'heic-a-jpg'],
  },
  'png-a-pdf': {
    id: 'png-to-pdf', from: 'PNG', to: 'PDF', keyword: 'convertir PNG a PDF',
    title: 'Convertir PNG a PDF online', description: 'Crea un documento PDF a partir de imágenes PNG para compartir, imprimir o reunir capturas y gráficos en un solo archivo.',
    why: 'Un PDF facilita distribuir varias imágenes como un documento. Ten en cuenta que el tamaño del archivo dependerá de la resolución y de la cantidad de imágenes.',
    faq: [['¿Puedo convertir varios PNG a un PDF?', 'Añade las imágenes PNG al conversor y revisa el documento resultante antes de descargarlo.'], ['¿La transparencia PNG se mantiene?', 'El resultado depende de cómo se coloque cada imagen en la página PDF. Comprueba el fondo y los bordes transparentes antes de usarlo.'], ['¿Se suben mis archivos?', 'La conversión compatible se procesa en el navegador, sin enviar las imágenes a un servidor de AnyFileX.']],
    related: ['jpg-a-pdf', 'pdf-a-jpg', 'webp-a-jpg'],
  },
  'heic-a-png': {
    id: 'heic-to-png', from: 'HEIC', to: 'PNG', keyword: 'convertir HEIC a PNG',
    title: 'Convertir HEIC a PNG online', description: 'Convierte fotos HEIC a PNG para usar una imagen decodificada en flujos de edición que requieren PNG. El procesamiento se realiza en tu navegador.',
    why: 'PNG evita una nueva compresión con pérdida al guardar los píxeles decodificados, aunque no puede recuperar detalles que ya no estén en la foto HEIC original. Los archivos PNG pueden ocupar más espacio.',
    faq: [['¿PNG mejora la calidad del HEIC?', 'No restaura detalles perdidos en el archivo original. PNG conserva los píxeles decodificados sin añadir otra compresión con pérdida.'], ['¿Mis fotos HEIC se suben?', 'No. La conversión compatible se ejecuta en el navegador y las fotos permanecen en tu dispositivo.'], ['¿Por qué el PNG puede ser más grande?', 'PNG usa compresión sin pérdida y suele generar archivos mayores que HEIC, que está diseñado para ahorrar espacio.']],
    related: ['heic-a-jpg', 'webp-a-jpg', 'png-a-pdf'],
  },
  'pdf-a-png': {
    id: 'pdf-to-png', from: 'PDF', to: 'PNG', keyword: 'convertir PDF a PNG',
    title: 'Convertir PDF a PNG online', description: 'Convierte las páginas de un documento PDF en imágenes PNG para reutilizar gráficos, compartir páginas o crear capturas nítidas.',
    why: 'PNG conserva los píxeles renderizados sin añadir compresión con pérdida, pero el texto y los elementos vectoriales se convierten en imagen. Mantén el PDF original si necesitas seleccionar o buscar texto.',
    faq: [['¿Puedo guardar cada página como PNG?', 'Sí. El conversor renderiza las páginas del documento como imágenes independientes para que puedas descargarlas.'], ['¿El texto del PNG se puede seleccionar?', 'No. El PNG contiene píxeles, no texto editable. Conserva el PDF original para copiar o buscar texto.'], ['¿Se envía el documento a un servidor?', 'No. El procesamiento compatible se realiza localmente en tu navegador.']],
    related: ['pdf-a-jpg', 'jpg-a-pdf', 'png-a-pdf'],
  },
  'heic-a-pdf': {
    id: 'heic-to-pdf', from: 'HEIC', to: 'PDF', keyword: 'convertir imagen a PDF',
    title: 'Convertir fotos HEIC a PDF online', description: 'Convierte fotos HEIC de iPhone en un PDF listo para compartir, imprimir o archivar. Añade imágenes y procesa los archivos localmente en tu navegador.',
    why: 'PDF es práctico para enviar recibos, formularios y fotos como documento. Comprueba la orientación y el tamaño de página antes de compartir el archivo.',
    faq: [['¿Puedo poner varias fotos en un PDF?', 'El conversor admite procesamiento por lotes. Añade las fotos que quieras incluir y revisa el documento generado.'], ['¿Mis fotos se suben a internet?', 'No. La conversión compatible se ejecuta en tu navegador; las fotos no se envían a AnyFileX.'], ['¿Puedo convertir HEIC a PDF desde un iPhone?', 'Puedes abrir AnyFileX en un navegador compatible y seleccionar fotos HEIC desde tu dispositivo. El soporte depende del navegador y del formato del archivo.']],
    related: ['heic-a-jpg', 'heic-a-png', 'jpg-a-pdf'],
  },
} as const;

export type SpanishConversionSlug = keyof typeof conversions;
export const SPANISH_CONVERSION_SLUGS = Object.keys(conversions) as SpanishConversionSlug[];

export function SpanishConversionLanding({ slug }: { slug: string }) {
  const page = conversions[slug as SpanishConversionSlug];
  if (!page) return null;

  return <div className="bg-slate-50 dark:bg-slate-950">
    <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950 md:py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300">Conversor gratis y privado en tu navegador</span>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">{page.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{page.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500"><span className="text-emerald-600 dark:text-emerald-400">✓ Procesamiento local</span><span className="text-blue-600 dark:text-blue-400">✓ Sin subir archivos</span><span>✓ Sin cuenta</span></div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 className="mb-8 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Conversor de {page.from} a {page.to}</h2><ConvertersClient converterId={page.id} /></div>
    </section>

    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Cómo convertir</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Selecciona tus archivos {page.from}, espera el procesamiento local y descarga el resultado {page.to}. Revisa la conversión antes de compartirla.</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Cuándo usar {page.to}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{page.why}</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Privacidad</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Los archivos compatibles se procesan en la memoria de tu navegador. No se guardan en una cola de servidor ni se envían a AnyFileX.</p></article>
      </div>
      <section className="mt-12"><h2 className="text-2xl font-black text-slate-900 dark:text-white">Preguntas frecuentes sobre {page.keyword.toLowerCase()}</h2><div className="mt-5 space-y-4">{page.faq.map(([question, answer]) => <article key={question} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold text-slate-900 dark:text-white">{question}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p></article>)}</div></section>
      <nav aria-label="Conversiones relacionadas" className="mt-12"><h2 className="text-xl font-black text-slate-900 dark:text-white">Más conversiones de archivos</h2><div className="mt-4 flex flex-wrap gap-3">{page.related.map((related) => { const relatedPage = conversions[related as SpanishConversionSlug]; return <Link key={related} href={`/es/convertir/${related}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:text-blue-300">{relatedPage.keyword}</Link>; })}</div></nav>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'HowTo', name: page.title, description: page.description, inLanguage: 'es', url: `https://anyfilex.com/es/convertir/${slug}`, step: [{ '@type': 'HowToStep', name: 'Selecciona tus archivos', text: `Elige los archivos ${page.from} que quieres convertir.` }, { '@type': 'HowToStep', name: 'Convierte en el navegador', text: 'El procesamiento compatible se ejecuta localmente en tu navegador.' }, { '@type': 'HowToStep', name: 'Descarga el resultado', text: `Descarga y revisa los archivos ${page.to} generados.` }] }) }} />
  </div>;
}

export function getSpanishConversionMetadata(slug: string) {
  const page = conversions[slug as SpanishConversionSlug];
  return page ? { title: page.title, description: page.description, keywords: [page.keyword, `pasar ${page.from} a ${page.to}`, `convertidor de ${page.from.toLowerCase()} a ${page.to.toLowerCase()}`] } : null;
}
