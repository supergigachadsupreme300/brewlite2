'use client';

import React from 'react';
import { ProductCategory } from '../types/product';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES: { label: string; value: string; icon: string }[] = [
  { label: 'Tất cả thực đơn', value: 'ALL', icon: '✨' },
  { label: 'Cà phê', value: 'COFFEE', icon: '☕' },
  { label: 'Trà trái cây', value: 'TEA', icon: '🍃' },
  { label: 'Đá xay Freeze', value: 'FREEZE', icon: '🥤' },
  { label: 'Bánh ngọt & Pastry', value: 'PASTRY', icon: '🥐' },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.625rem',
        overflowX: 'auto',
        padding: '0.5rem 0 1rem 0',
        scrollbarWidth: 'none',
      }}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelectCategory(cat.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              whiteSpace: 'nowrap',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: isSelected ? 600 : 500,
              backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface)',
              color: isSelected ? '#ffffff' : 'var(--text-main)',
              border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
              boxShadow: isSelected ? '0 4px 12px rgba(74, 44, 17, 0.18)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
