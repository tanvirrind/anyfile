'use client';

import { useRouter } from 'next/navigation';
import { FileIdentifierUploader } from '@/components/FileIdentifierUploader';
import { AppRoute } from '@/types';
import { routeToPath } from '@/utils/router';

export function SpanishFileIdentifierTool() {
  const router = useRouter();
  const navigate = (route: AppRoute) => {
    const path = routeToPath(route);
    router.push(path.startsWith('/tools/file-identifier') ? `/es${path}` : path);
    window.scrollTo(0, 0);
  };

  return <div>
    <section className="mx-auto max-w-4xl px-4 pt-12 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Análisis local en el navegador</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Identificar un archivo desconocido</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Sube un archivo desconocido para comprobar sus magic bytes, formato probable y firma técnica. El análisis se realiza localmente en tu navegador.</p>
    </section>
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <FileIdentifierUploader onNavigate={navigate} />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ['Verificación de magic bytes', 'Comprueba la firma hexadecimal del archivo, aunque la extensión sea incorrecta.'],
          ['Sin almacenamiento remoto', 'El análisis se ejecuta en la memoria de tu navegador y tus archivos no se suben.'],
          ['Huella SHA-256', 'Genera una huella criptográfica para verificar la integridad del archivo.'],
        ].map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p></article>)}
      </div>
    </section>
  </div>;
}
