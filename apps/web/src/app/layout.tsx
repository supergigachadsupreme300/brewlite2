import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'BrewLite',
  description: 'BrewLite application shell',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
