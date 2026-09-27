'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export function DutchNewsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-blue-50/50 py-16 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 md:py-24">
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">@</div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">AnyFileX-nieuwsbrief</span>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Blijf op de hoogte met AnyFileX</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">Ontvang maandelijks nieuwe bestandsgidsen, software-updates en praktische diagnostische tips. Geen spam.</p>
          {!subscribed ? <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Vul je e-mailadres in..." className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /><button type="submit" className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700">Inschrijven →</button></form> : <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">Bedankt! Je bent ingeschreven voor de AnyFileX-nieuwsbrief.</div>}
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Voor ontwikkelaars, systeembeheerders en digitale archivarissen. Uitschrijven kan altijd.</p>
          <Link href="/nl/guides" className="mt-5 inline-block text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">Bekijk ondertussen de nieuwste gidsen →</Link>
        </div>
      </div>
    </section>
  );
}

