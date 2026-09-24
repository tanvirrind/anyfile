'use client';

import React, { useEffect, useState } from 'react';
import { ExtensionDetailPage } from '../../views/ExtensionDetailPage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { useRouter } from 'next/navigation';
import { consumePendingFile } from '../../lib/fileTransferStore';

interface ExtensionDetailClientProps {
  ext: string;
}

export function ExtensionDetailClient({ ext }: ExtensionDetailClientProps) {
  const router = useRouter();
  const [initialFile, setInitialFile] = useState<File | null>(null);

  useEffect(() => {
    const file = consumePendingFile();
    if (file) setInitialFile(file);
  }, []);

  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    router.push(path);
    window.scrollTo(0, 0);
  };

  return <ExtensionDetailPage ext={ext} onNavigate={handleNavigate} initialFile={initialFile} />;
}
