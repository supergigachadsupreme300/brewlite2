/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Product } from '../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [ice, setIce] = useState('100%');
  const [sugar, setSugar] = useState('100%');

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const sizeSurcharge = size === 'L' ? 8000 : size === 'M' ? 4000 : 0;
  const finalPrice = product.price + sizeSurcharge;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Modal Image */}
        <div style={{ position: 'relative', height: '240px', backgroundColor: '#f3efe8' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {product.name}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.625rem',
                  borderRadius: '999px',
                  backgroundColor: isOutOfStock ? '#ffe5e5' : '#e3f9f5',
                  color: isOutOfStock ? 'var(--danger)' : 'var(--accent)',
                }}
              >
                {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} ly`}
              </span>
            </div>
            <p style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {product.description}
            </p>
          </div>

          {/* Size Options */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
              TÙY CHỌN KÍCH CỠ (SIZE)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { key: 'S', label: 'Size S (Nhỏ)', add: 0 },
                { key: 'M', label: 'Size M (Tiêu chuẩn)', add: 4000 },
                { key: 'L', label: 'Size L (Lớn)', add: 8000 },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSize(s.key as 'S' | 'M' | 'L')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    border: `1.5px solid ${size === s.key ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: size === s.key ? '#fbf6f0' : '#fff',
                    color: size === s.key ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: size === s.key ? 700 : 500,
                  }}
                >
                  <div>{s.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    +{s.add.toLocaleString('vi-VN')} đ
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sweetness & Ice */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.375rem' }}>
                MỨC ĐƯỜNG
              </label>
              <select
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#fff',
                  fontSize: '0.8125rem',
                }}
              >
                <option value="100%">100% đường (Chuẩn)</option>
                <option value="70%">70% đường</option>
                <option value="50%">50% đường</option>
                <option value="0%">Không đường</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.375rem' }}>
                LƯỢNG ĐÁ
              </label>
              <select
                value={ice}
                onChange={(e) => setIce(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#fff',
                  fontSize: '0.8125rem',
                }}
              >
                <option value="100%">100% đá (Chuẩn)</option>
                <option value="50%">Ít đá</option>
                <option value="0%">Không đá</option>
              </select>
            </div>
          </div>

          {/* Price Summary and Close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Đơn giá: </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                {finalPrice.toLocaleString('vi-VN')} đ
              </strong>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#fff',
                padding: '0.625rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
