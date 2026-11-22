'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Product } from '../types/product';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich and bold single shot espresso.',
    price: 2.5,
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop&q=60',
    category: 'Coffee',
    stock: 12,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Americano',
    description: 'Espresso diluted with hot water for a smooth cup.',
    price: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    category: 'Coffee',
    stock: 8,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and a thick foam layer.',
    price: 3.75,
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60',
    category: 'Coffee',
    stock: 5,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Latte',
    description: 'Creamy espresso with steamed milk.',
    price: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&auto=format&fit=crop&q=60',
    category: 'Coffee',
    stock: 7,
    isAvailable: true,
  },
  {
    id: 'prod-001',
    name: 'Cà phê Phin Sữa Đá',
    description: 'Cà phê Robusta Đắk Lắk pha phin truyền thống hòa quyện cùng sữa đặc béo ngậy thơm nồng.',
    category: 'Coffee',
    price: 29000,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-002',
    name: 'Bạc Xỉu Sữa Tươi Nóng/Đá',
    description: 'Hương vị tuổi thơ với nhiều sữa, ít cà phê đắng nhẹ, thơm nồng cốt sữa tươi.',
    category: 'Coffee',
    price: 32000,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-004',
    name: 'Trà Đào Cam Sả Đặc Biệt',
    description: 'Trà đen Ceylon đậm đà, những miếng đào giòn ngọt lịm cùng vị chua thanh của cam tươi.',
    category: 'Tea',
    price: 39000,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Croissant Bơ Pháp',
    description: 'Bánh sừng bò ngàn lớp thơm lừng nướng cùng bơ Pháp.',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
    category: 'Pastry',
    stock: 10,
    isAvailable: true,
  },
];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Đọc số lượng giỏ hàng từ localStorage (đồng bộ với phần Cart của teammate)
  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem('brewlite_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartCount(parsed.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity ?? 1), 0));
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  // Tải danh sách sản phẩm từ API
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // API chưa chạy: giữ danh sách rỗng
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        selectedCategory === 'ALL' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchKeyword.trim() ||
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchKeyword]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} cartCount={cartCount} />

      {/* Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #4a2c11 0%, #2b1706 100%)',
          color: '#ffffff',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
            Thực đơn đồ uống & Bánh ngọt BrewLite
          </h2>
          <p style={{ color: '#d4a373', fontSize: '0.9375rem', maxWidth: '550px', margin: '0 auto' }}>
            Khám phá hương vị cà phê pha phin truyền thống, trà hoa quả tươi và các loại bánh tươi mỗi ngày.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link
              href="/checkout"
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--secondary)',
                color: '#2b1706',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              Xem Giỏ hàng ({cartCount})
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Hiển thị <strong>{filteredProducts.length}</strong> món trong thực đơn
            {searchKeyword && (
              <span>
                {' '}cho từ khóa &quot;<em>{searchKeyword}</em>&quot;
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <p role="status" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Đang tải thực đơn...
          </p>
        ) : filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>☕🔍</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Không tìm thấy món phù hợp
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Vui lòng thử tìm kiếm bằng từ khóa khác hoặc bấm xem tất cả thực đơn.
            </p>
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedCategory('ALL');
              }}
              style={{
                marginTop: '1rem',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Xem tất cả thực đơn
            </button>
          </div>
        )}
      </main>

      {/* Modal chi tiết sản phẩm */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: '#f6f1ea',
          padding: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        <p>© 2026 BrewLite Coffee. Danh mục thực đơn & sản phẩm.</p>
      </footer>
    </div>
  );
}
