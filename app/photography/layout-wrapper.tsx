'use client';

import PhotographyClient from '@/app/photography/photography-client';

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhotographyClient>{children}</PhotographyClient>;
}