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
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const TOPPING_OPTIONS = [
    { key: 'pearl', label: 'Trân châu đen', add: 5000 },
    { key: 'jelly', label: 'Thạch cà phê', add: 5000 },
    { key: 'cheese', label: 'Kem cheese', add: 8000 },
    { key: 'caramel', label: 'Siro caramel', add: 5000 },
  ];

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const sizeSurcharge = size === 'L' ? 8000 : size === 'M' ? 4000 : 0;
  const toppingSurcharge = toppings.reduce(
    (sum, t) => sum + (TOPPING_OPTIONS.find((o) => o.key === t)?.add ?? 0),
    0,
  );
  const finalPrice = product.price + sizeSurcharge + toppingSurcharge;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    try {
      const stored = window.localStorage.getItem('brewlite_cart');
      const cart: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        size: 'S' | 'M' | 'L';
        sugar: string;
        ice: string;
        toppings?: string[];
      }> = stored ? JSON.parse(stored) : [];

      const existingIndex = cart.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.sugar === sugar &&
          item.ice === ice &&
          JSON.stringify(item.toppings ?? []) === JSON.stringify(toppings),
      );
      if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: finalPrice,
          quantity,
          size,
          sugar,
          ice,
          toppings: toppings.length ? [...toppings] : undefined,
        });
      }
      window.localStorage.setItem('brewlite_cart', JSON.stringify(cart));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // ignore
    }
  };

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
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60';
            }}
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

          {/* Toppings */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
              TOPPING (tùy chọn)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {TOPPING_OPTIONS.map((t) => {
                const selected = toppings.includes(t.key);
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() =>
                      setToppings((prev) =>
                        selected ? prev.filter((x) => x !== t.key) : [...prev, t.key],
                      )
                    }
                    style={{
                      padding: '0.35rem 0.7rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: selected ? '#fbf6f0' : '#fff',
                      color: selected ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: selected ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label} (+{t.add.toLocaleString('vi-VN')}đ)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>SỐ LƯỢNG</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: '#fff',
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                }}
              >
                -
              </button>
              <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 700 }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: '#fff',
                  cursor: quantity >= product.stock || isOutOfStock ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary and actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Đơn giá: </span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                {finalPrice.toLocaleString('vi-VN')} đ
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{
                  backgroundColor: isOutOfStock ? '#cccccc' : 'var(--primary)',
                  color: '#fff',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                }}
              >
                {added ? 'Đã thêm ✓' : 'Thêm vào giỏ'}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  padding: '0.625rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
