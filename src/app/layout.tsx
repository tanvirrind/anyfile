import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';
import '@/index.css';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.anyfilex.com'),
  title: {
    template: '%s | AnyFileX',
    default: 'AnyFileX – Universal File Format Intelligence & Tools',
  },
  description: 'Open Any File in Seconds with AnyFileX - Convert, repair, identify, and understand any digital file format.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'AnyFileX',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AnyFileX - Universal File Format Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`try { var t = localStorage.getItem('theme'); if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark'); } catch (_) {}`}
        </Script>
      </head>
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}
