'use client';

import React from 'react';

interface WorksClientProps {
  children: React.ReactNode;
}

export default function WorksClient({ children }: WorksClientProps) {
  return <>{children}</>;
}