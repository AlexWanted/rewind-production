'use client';

import React from 'react';

interface PhotographyClientProps {
  children: React.ReactNode;
}

export default function PhotographyClient({ children }: PhotographyClientProps) {
  return <>{children}</>;
}