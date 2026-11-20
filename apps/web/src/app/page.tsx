'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Product } from '../types/product';

// Dữ liệu sản phẩm mẫu dự phòng (fallback) khớp hoàn toàn với Backend API
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Cà phê Phin Sữa Đá',
    description: 'Cà phê Robusta Đắk Lắk pha phin truyền thống hòa quyện cùng sữa đặc béo ngậy thơm nồng.',
    category: 'COFFEE',
    price: 29000,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-002',
    name: 'Bạc Xỉu Sữa Tươi Nóng/Đá',
    description: 'Hương vị tuổi thơ với nhiều sữa, ít cà phê đắng nhẹ, thơm nồng cốt sữa tươi.',
    category: 'COFFEE',
    price: 32000,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-003',
    name: 'Cold Brew Cam Vàng Sả',
    description: 'Cà phê ủ lạnh 18 tiếng thanh mát kết hợp lát cam tươi và hương sả nồng ấm giải nhiệt.',
    category: 'COFFEE',
    price: 45000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-004',
    name: 'Trà Đào Cam Sả Đặc Biệt',
    description: 'Trà đen Ceylon đậm đà, những miếng đào giòn ngọt lịm cùng vị chua thanh của cam tươi.',
    category: 'TEA',
    price: 39000,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-005',
    name: 'Trà Hoa Cúc Mật Ong Nhiệt Đới',
    description: 'Thanh lọc cơ thể với trà cúc hoa thảo mộc vàng óng quyện chút mật ong hoa nhãn dịu ngọt.',
    category: 'TEA',
    price: 35000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-006',
    name: 'Matcha Uji Đá Xay Kem Cheese',
    description: 'Bột trà xanh Uji Nhật Bản đá xay mịn màng phủ lớp kem cheese béo mặn sánh mịn.',
    category: 'FREEZE',
    price: 49000,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-007',
    name: 'Cà Phê Cốt Dừa Đá Xay',
    description: 'Vị béo thơm đậm vị cốt dừa Bến Tre xay cùng cà phê espresso đắng nhẹ đặc trưng.',
    category: 'FREEZE',
    price: 49000,
    stock: 0, // Mô phỏng hết hàng để test tính năng FR-PROD-04
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
  {
    id: 'prod-008',
    name: 'Bánh Croissant Bơ Tỏi Nướng Giòn',
    description: 'Bánh sừng bò ngàn lớp thơm lừng nướng cùng bơ Pháp và sốt tỏi tây thơm phức.',
    category: 'PASTRY',
    price: 32000,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
    isAvailable: true,
  },
];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Gọi API NestJS nếu Backend đang chạy
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    fetch(`${apiUrl}/products`)
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
        // Fallback danh sách ban đầu nếu API chưa khởi động ở môi trường dev
      });
  }, []);

  // Lọc sản phẩm theo Category và Tìm kiếm từ khóa
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        !searchKeyword.trim() ||
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchKeyword]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Header searchKeyword={searchKeyword} onSearchChange={setSearchKeyword} />

      {/* Hero Banner Thực đơn */}
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
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '1.5rem', flex: 1 }}>
        {/* Category Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Results Info & Count */}
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

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
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
          /* Empty Search State */
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
