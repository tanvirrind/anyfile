import type { Metadata } from 'next';
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
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}
