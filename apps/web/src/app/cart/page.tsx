'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  readCart as readCartLib,
  writeCart as writeCartLib,
  updateQuantity as updateQuantityLib,
  removeItem as removeItemLib,
  clearCart as clearCartLib,
  subtotal as subtotalLib,
  totalItems as totalItemsLib,
  type CartItem,
} from '../../lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(readCartLib(window.localStorage));
    setLoaded(true);
  }, []);

  const updateQuantity = useCallback((index: number, delta: number) => {
    setCart((prev) => {
      const next = updateQuantityLib(prev, index, delta);
      writeCartLib(window.localStorage, next);
      return next;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setCart((prev) => {
      const next = removeItemLib(prev, index);
      writeCartLib(window.localStorage, next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(clearCartLib());
    writeCartLib(window.localStorage, []);
  }, []);

  const subtotal = subtotalLib(cart);
  const totalItems = totalItemsLib(cart);

  if (!loaded) {
    return (
      <main style={{ maxWidth: '520px', margin: '0 auto', padding: '1rem' }}>
        <p role="status">Đang tải giỏ hàng...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
          Giỏ hàng ({totalItems})
        </h1>
        <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Thực đơn
        </Link>
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            border: '1px dashed #ccc',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#333' }}>
            Giỏ hàng trống
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
            Chưa có sản phẩm nào trong giỏ. Hãy chọn món từ thực đơn.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              backgroundColor: '#2e7d32',
              color: '#fff',
              padding: '0.5rem 1.25rem',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Xem thực đơn
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cart.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${index}`}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '0.75rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#fff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      Size {item.size || 'M'}
                      {item.sugar ? ` • Đường ${item.sugar}` : ''}
                      {item.ice ? ` • Đá ${item.ice}` : ''}
                      {item.toppings && item.toppings.length
                        ? ` • Topping: ${item.toppings.join(', ')}`
                        : ''}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#2e7d32', marginTop: '0.25rem', fontWeight: 600 }}>
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    title="Xóa"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#999',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, -1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                  </div>
                  <strong style={{ color: '#2e7d32' }}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              border: '1px solid #e0e0e0',
              borderRadius: '0.75rem',
              backgroundColor: '#fafafa',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.1rem',
                fontWeight: 700,
              }}
            >
              <span>Tổng cộng:</span>
              <span style={{ color: '#2e7d32' }}>
                {subtotal.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={clearCart}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ccc',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Xóa giỏ
              </button>
              <Link
                href="/checkout"
                style={{
                  flex: 2,
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.6rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#2e7d32',
                  color: '#fff',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Thanh toán →
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}