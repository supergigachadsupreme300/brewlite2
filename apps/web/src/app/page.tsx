'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/products`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Unable to load the menu. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  return (
    <main
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>BrewLite Menu</h1>
        <p style={{ margin: '0.25rem 0 0', color: '#555', fontSize: '0.9rem' }}>
          Fresh coffee and pastries, ready to order.
        </p>
      </header>

      {loading && (
        <p role="status" aria-live="polite">
          Loading menu...
        </p>
      )}

      {error && (
        <p role="alert" style={{ color: '#b00020' }}>
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p role="status">No products available right now.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                opacity: product.available ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <strong>{product.name}</strong>
                <span>${product.price.toFixed(2)}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#777' }}>
                {product.category}
              </span>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {product.description}
              </p>
              {!product.available && (
                <span style={{ fontSize: '0.8rem', color: '#b00020' }}>
                  Out of stock
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}