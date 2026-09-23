import type { Metadata } from 'next';
import React from 'react';
import { NotFoundClient } from '@/components/common/NotFoundClient';

export const metadata: Metadata = {
  title: '404 – Page Not Found | AnyFileX',
  description: 'The requested page, file extension specification, or utility could not be found on AnyFileX.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
