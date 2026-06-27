'use client';

import HomeClient from '@/app/page-client';

export default function Home({ children }: { children: React.ReactNode }) {
  return <HomeClient>{children}</HomeClient>;
}