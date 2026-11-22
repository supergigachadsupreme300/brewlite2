'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isAvailable: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const SIZE_OPTIONS: { key: 'S' | 'M' | 'L'; label: string; add: number }[] = [
  { key: 'S', label: 'Size S (Nhỏ)', add: 0 },
  { key: 'M', label: 'Size M (Tiêu chuẩn)', add: 4000 },
  { key: 'L', label: 'Size L (Lớn)', add: 8000 },
];

const SUGAR_OPTIONS = ['100%', '70%', '50%', '0%'];
const ICE_OPTIONS = ['100%', '50%', '0%'];
const TOPPING_OPTIONS: { key: string; label: string; add: number }[] = [
  { key: 'pearl', label: 'Trân châu đen', add: 5000 },
  { key: 'jelly', label: 'Thạch cà phê', add: 5000 },
  { key: 'cheese', label: 'Kem cheese', add: 8000 },
  { key: 'caramel', label: 'Siro caramel', add: 5000 },
];

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [sugar, setSugar] = useState<string>('100%');
  const [ice, setIce] = useState<string>('100%');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          throw new Error('Sản phẩm không tồn tại');
        }
        if (response.status === 400) {
          throw new Error('Mã sản phẩm không hợp lệ');
        }
        if (!response.ok) {
          throw new Error(`Yêu cầu thất bại với mã ${response.status}`);
        }
        const data = (await response.json()) as Product;
        setProduct(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message || 'Không thể tải chi tiết sản phẩm.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id]);

  const isOutOfStock = !product || product.stock <= 0;

  const sizeSurcharge = SIZE_OPTIONS.find((s) => s.key === size)?.add ?? 0;
  const toppingSurcharge = toppings.reduce(
    (sum, t) => sum + (TOPPING_OPTIONS.find((o) => o.key === t)?.add ?? 0),
    0,
  );
  const finalPrice = product ? product.price + sizeSurcharge + toppingSurcharge : 0;

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
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
      setAddedMessage(`Đã thêm ${quantity} x ${product.name} (Size ${size}) vào giỏ hàng.`);
    } catch {
      setAddedMessage('Không thể thêm vào giỏ hàng.');
    }
  };

  return (
    <main
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginBottom: '1rem',
          color: '#0066cc',
          textDecoration: 'none',
          fontSize: '0.9rem',
        }}
      >
        ← Quay lại thực đơn
      </a>

      {loading && <p role="status">Đang tải chi tiết sản phẩm...</p>}

      {error && (
        <p role="alert" style={{ color: '#b00020' }}>
          {error}
        </p>
      )}

      {!loading && !error && product && (
        <article style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Image */}
          <div
            style={{
              position: 'relative',
              height: '260px',
              backgroundColor: '#f3efe8',
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.625rem',
                borderRadius: '999px',
                backgroundColor: isOutOfStock ? '#ffe5e5' : '#e3f9f5',
                color: isOutOfStock ? '#b00020' : '#2e7d32',
              }}
            >
              {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock}`}
            </span>
          </div>

          {/* Info */}
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
              {product.name}
            </h1>
            <span style={{ fontSize: '0.85rem', color: '#777' }}>
              {product.category}
            </span>
            <p style={{ margin: '0.5rem 0', color: '#444' }}>
              {product.description}
            </p>
            <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>
              {product.price.toLocaleString('vi-VN')} đ
            </strong>
          </div>

          {/* Size */}
          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              TÙY CHỌN KÍCH CỠ (SIZE)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSize(s.key)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    border: `1.5px solid ${size === s.key ? '#2e7d32' : '#ccc'}`,
                    backgroundColor: size === s.key ? '#e8f5e9' : '#fff',
                    color: size === s.key ? '#2e7d32' : '#333',
                    fontWeight: size === s.key ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  <div>{s.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>
                    +{s.add.toLocaleString('vi-VN')} đ
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sugar & Ice */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '0.375rem',
                }}
              >
                MỨC ĐƯỜNG
              </label>
              <select
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ccc',
                  fontSize: '0.8125rem',
                }}
              >
                {SUGAR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '100%' ? '100% đường (Chuẩn)' : `${opt} đường`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '0.375rem',
                }}
              >
                LƯỢNG ĐÁ
              </label>
              <select
                value={ice}
                onChange={(e) => setIce(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ccc',
                  fontSize: '0.8125rem',
                }}
              >
                {ICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === '100%' ? '100% đá (Chuẩn)' : `${opt} đá`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toppings */}
          <div>
            <label
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
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
                        selected
                          ? prev.filter((x) => x !== t.key)
                          : [...prev, t.key],
                      )
                    }
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      border: `1.5px solid ${selected ? '#2e7d32' : '#ccc'}`,
                      backgroundColor: selected ? '#e8f5e9' : '#fff',
                      color: selected ? '#2e7d32' : '#333',
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
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #ccc',
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
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  background: '#fff',
                  cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Price summary */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid #eee',
            }}
          >
            <span style={{ fontSize: '0.9rem', color: '#555' }}>Đơn giá (đã gồm size):</span>
            <strong style={{ fontSize: '1.25rem', color: '#2e7d32' }}>
              {finalPrice.toLocaleString('vi-VN')} đ
            </strong>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: '100%',
              padding: '0.8rem',
              backgroundColor: isOutOfStock ? '#cccccc' : '#2e7d32',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
          >
            {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </button>

          {addedMessage && (
            <p
              role="status"
              style={{
                color: '#2e7d32',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              {addedMessage}{' '}
              <a href="/checkout" style={{ color: '#0066cc' }}>
                Xem giỏ hàng →
              </a>
            </p>
          )}
        </article>
      )}
    </main>
  );
}