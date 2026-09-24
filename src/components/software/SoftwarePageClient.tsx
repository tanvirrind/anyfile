'use client';

import React from 'react';
import { SoftwarePage } from '../../views/SoftwarePage';
import { AppRoute } from '../../types';
import { routeToPath } from '../../utils/router';
import { useRouter } from 'next/navigation';

interface SoftwarePageClientProps {
  softwareId?: string;
}

export function SoftwarePageClient({ softwareId }: SoftwarePageClientProps) {
  const router = useRouter();
  const handleNavigate = (route: AppRoute) => {
    const path = routeToPath(route);
    router.push(path);
    window.scrollTo(0, 0);
  };

  return <SoftwarePage onNavigate={handleNavigate} selectedSoftwareId={softwareId} />;
}
