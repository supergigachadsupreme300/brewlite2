'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          throw new Error('Product not found');
        }
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = (await response.json()) as Product;
        setProduct(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message || 'Unable to load product details.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [id]);

  return (
    <main
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <a href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to menu
      </a>

      {loading && <p role="status">Loading product...</p>}

      {error && (
        <p role="alert" style={{ color: '#b00020' }}>
          {error}
        </p>
      )}

      {!loading && !error && product && (
        <article
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>{product.name}</h1>
          <span style={{ fontSize: '0.85rem', color: '#777' }}>
            {product.category}
          </span>
          <p style={{ margin: 0 }}>{product.description}</p>
          <strong style={{ fontSize: '1.1rem' }}>
            ${product.price.toFixed(2)}
          </strong>
          {product.stock <= 0 && (
            <span style={{ color: '#b00020', fontSize: '0.9rem' }}>
              Out of stock
            </span>
          )}
          <span style={{ fontSize: '0.9rem', color: '#555' }}>
            Stock: {product.stock}
          </span>
        </article>
      )}
    </main>
  );
}