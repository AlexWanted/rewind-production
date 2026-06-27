'use client';

import React from 'react';

interface HomeClientProps {
  children: React.ReactNode;
}

export default function HomeClient({ children }: HomeClientProps) {
  return <>{children}</>;
}