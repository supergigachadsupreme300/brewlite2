import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrewLite – Thực đơn & Danh sách sản phẩm',
  description: 'Thưởng thức cà phê rang xay nguyên chất, trà trái cây thanh mát và bánh ngọt.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
