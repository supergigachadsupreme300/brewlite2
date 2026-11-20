/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Product Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          backgroundColor: '#f3efe8',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={() => onSelect(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isOutOfStock ? 0.6 : 1,
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Stock status badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: isOutOfStock ? 'rgba(230, 57, 70, 0.9)' : 'rgba(42, 157, 143, 0.9)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock}`}
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        <h3
          onClick={() => onSelect(product)}
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            cursor: 'pointer',
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {product.description}
        </p>

        {/* Price & Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid #f3efe8',
          }}
        >
          <div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--primary)' }}>
              {product.price.toLocaleString('vi-VN')}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', marginLeft: '2px' }}>đ</span>
          </div>

          <button
            onClick={() => onSelect(product)}
            style={{
              backgroundColor: isOutOfStock ? '#e0d8cf' : 'var(--primary)',
              color: isOutOfStock ? '#9c9288' : '#ffffff',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
