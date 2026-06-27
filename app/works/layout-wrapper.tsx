'use client';

import WorksClient from '@/app/works/works-client';

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorksClient>{children}</WorksClient>;
}