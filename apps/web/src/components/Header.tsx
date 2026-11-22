'use client';

import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  cartCount?: number;
}

export function Header({ searchKeyword, onSearchChange, cartCount = 0 }: HeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(253, 251, 247, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '0.875rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            ☕
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
              BrewLite
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Specialty Coffee & Tea</p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: '1', maxWidth: '420px', minWidth: '220px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '0.4rem 1rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ marginRight: '0.5rem', opacity: 0.6 }}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm cà phê, trà, bánh ngọt..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
              }}
            />
            {searchKeyword && (
              <button
                onClick={() => onSearchChange('')}
                style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '0 0.25rem' }}
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Cart badge */}
        <Link
          href="/cart"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '0.4rem 0.85rem',
            textDecoration: 'none',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          🛒
          {cartCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--primary)',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
