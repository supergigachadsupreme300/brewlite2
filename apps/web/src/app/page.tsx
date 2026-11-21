'use client';

import Link from 'next/link';
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

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: 'S' | 'M' | 'L';
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.description === 'string' &&
    typeof value.price === 'number' &&
    typeof value.imageUrl === 'string' &&
    typeof value.category === 'string' &&
    typeof value.stock === 'number' &&
    typeof value.isAvailable === 'boolean'
  );
}

function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.productId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.quantity === 'number' &&
    (value.size === 'S' || value.size === 'M' || value.size === 'L')
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Tải menu thất bại (${response.status}).`);
        }

        const body: unknown = await response.json();
        if (!Array.isArray(body) || !body.every(isProduct)) {
          throw new Error('API trả về danh sách sản phẩm không hợp lệ.');
        }

        setProducts(body);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Không thể tải menu từ API.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem('brewlite_cart');
      if (!storedCart) {
        return;
      }

      const parsedCart: unknown = JSON.parse(storedCart);
      if (!Array.isArray(parsedCart) || !parsedCart.every(isCartItem)) {
        throw new Error('Dữ liệu giỏ hàng không hợp lệ. Hãy xóa giỏ và thử lại.');
      }

      setCartCount(
        parsedCart.reduce((total, item) => total + item.quantity, 0),
      );
    } catch (loadError) {
      setCartMessage(
        loadError instanceof Error
          ? loadError.message
          : 'Không thể đọc giỏ hàng trên trình duyệt.',
      );
    }
  }, []);

  function addToCart(product: Product) {
    try {
      const storedCart = window.localStorage.getItem('brewlite_cart');
      const parsedCart: unknown = storedCart ? JSON.parse(storedCart) : [];
      if (!Array.isArray(parsedCart) || !parsedCart.every(isCartItem)) {
        throw new Error('Dữ liệu giỏ hàng không hợp lệ. Hãy xóa giỏ và thử lại.');
      }

      const cart = [...parsedCart];
      const existingItem = cart.find((item) => item.productId === product.id);
      if (existingItem && existingItem.quantity >= product.stock) {
        setCartMessage(`"${product.name}" không còn đủ số lượng trong kho.`);
        return;
      }

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          size: 'M',
        });
      }

      window.localStorage.setItem('brewlite_cart', JSON.stringify(cart));
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
      setCartMessage(`Đã thêm ${product.name} vào giỏ hàng.`);
    } catch (cartError) {
      setCartMessage(
        cartError instanceof Error
          ? cartError.message
          : 'Không thể lưu giỏ hàng trên trình duyệt.',
      );
    }
  }

  return (
    <main
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>BrewLite</h1>
          <p style={{ color: '#666' }}>Menu được tải trực tiếp từ API.</p>
        </div>
        <Link href="/checkout" aria-label={`Giỏ hàng, ${cartCount} món`}>
          Giỏ hàng ({cartCount})
        </Link>
      </header>

      <section aria-labelledby="menu-title">
        <h2 id="menu-title">Menu</h2>
        {loading && <p role="status">Đang tải menu...</p>}
        {error && (
          <p role="alert" style={{ color: '#b00020' }}>
            {error} Kiểm tra API tại {API_BASE_URL} rồi tải lại trang.
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p>API hiện chưa có sản phẩm.</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '0.75rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#666', fontSize: '0.85rem' }}>
                {product.category}
              </span>
              <h3 style={{ margin: 0 }}>{product.name}</h3>
              <p style={{ margin: 0, color: '#555', flex: 1 }}>
                {product.description}
              </p>
              <strong>${product.price.toFixed(2)}</strong>
              <span style={{ color: product.stock > 0 ? '#2e7d32' : '#b00020' }}>
                {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href={`/products/${product.id}`}>Chi tiết</Link>
                <button
                  type="button"
                  disabled={!product.isAvailable || product.stock <= 0}
                  onClick={() => addToCart(product)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </article>
          ))}
        </div>
        {cartMessage && <p role="status">{cartMessage}</p>}
      </section>
    </main>
  );
}
