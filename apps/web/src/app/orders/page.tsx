'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'PAYMENT_FAILED'
  | 'CANCELLED';

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  unitPrice: number;
  lineTotal: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupType: 'TAKEAWAY' | 'DINE_IN';
  tableNumber?: string;
  paymentMethod: 'MOMO' | 'BANK_TRANSFER' | 'CARD' | 'WALLET';
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  PREPARING: 'Đang pha chế',
  READY: 'Sẵn sàng nhận món',
  COMPLETED: 'Đã hoàn thành',
  PAYMENT_FAILED: 'Thanh toán thất bại',
  CANCELLED: 'Đã hủy',
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  PENDING: { bg: '#fff8e1', color: '#b78103' },
  PAID: { bg: '#e8f5e9', color: '#2e7d32' },
  PREPARING: { bg: '#e3f2fd', color: '#1565c0' },
  READY: { bg: '#f3e5f5', color: '#7b1fa2' },
  COMPLETED: { bg: '#e0f2f1', color: '#00695c' },
  PAYMENT_FAILED: { bg: '#ffebee', color: '#c62828' },
  CANCELLED: { bg: '#eeeeee', color: '#616161' },
};

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PREPARING',
  'READY',
  'COMPLETED',
  'PAYMENT_FAILED',
  'CANCELLED',
];

function isOrder(value: unknown): value is Order {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.status === 'string' &&
    typeof v.total === 'number' &&
    typeof v.createdAt === 'string' &&
    Array.isArray(v.items)
  );
}

function readMockOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem('brewlite_mock_orders');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrder);
  } catch {
    return [];
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
}

export default function OrderHistoryPage() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        localStorage.getItem('token') || localStorage.getItem('brewlite_jwt');
      if (!token) {
        router.replace('/login');
        setOrders([]);
        setError('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('brewlite_jwt');
        router.replace('/login');
        setOrders([]);
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      let apiOrders: Order[] = [];
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          apiOrders = data.filter(isOrder);
        }
      } else {
        throw new Error(`Tải danh sách thất bại (${response.status})`);
      }

      const mockOrders = readMockOrders();
      const merged: Order[] = [...apiOrders];
      const existingIds = new Set(merged.map((o) => o.id));
      for (const mock of mockOrders) {
        if (!existingIds.has(mock.id)) {
          merged.push(mock);
        }
      }

      merged.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(merged);
    } catch (err) {
      const mockOrders = readMockOrders();
      if (mockOrders.length > 0) {
        mockOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(mockOrders);
        setError(null);
      } else {
        setError((err as Error).message || 'Không thể tải danh sách đơn hàng.');
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchSearch =
        keyword === '' || order.id.toLowerCase().includes(keyword);
      const matchStatus =
        statusFilter === 'ALL' || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const hasFilters = search.trim() !== '' || statusFilter !== 'ALL';

  return (
    <main
      style={{
        maxWidth: '640px',
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
          Lịch sử đơn hàng
        </h1>
        <Link
          href="/"
          style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}
        >
          ← Thực đơn
        </Link>
      </div>

      {/* Filters */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <input
          type="text"
          placeholder="Tìm theo mã đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            fontSize: '0.9rem',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            fontSize: '0.9rem',
          }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </section>

      {loading && <p role="status">Đang tải danh sách đơn hàng...</p>}

      {error && (
        <div role="alert" style={{ color: '#b00020', marginBottom: '0.75rem' }}>
          <p>{error}</p>
          <button
            type="button"
            onClick={loadOrders}
            style={{
              marginTop: '0.5rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '0.4rem',
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            border: '1px dashed #ccc',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#333' }}>
            Chưa có đơn hàng nào
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
            Bạn chưa đặt món nào. Hãy bắt đầu mua sắm nhé!
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
      )}

      {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            border: '1px dashed #ccc',
          }}
        >
          <p style={{ color: '#666' }}>Không tìm thấy đơn hàng phù hợp.</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
              }}
              style={{
                marginTop: '0.75rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.4rem',
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {!loading && filteredOrders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredOrders.map((order) => {
            const colors = STATUS_COLORS[order.status];
            const canPay =
              order.status === 'PENDING' || order.status === 'PAYMENT_FAILED';
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            return (
              <div
                key={order.id}
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
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <strong style={{ fontSize: '0.95rem' }}>{order.id}</strong>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor: colors.bg,
                      color: colors.color,
                    }}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    marginTop: '0.35rem',
                  }}
                >
                  {formatDate(order.createdAt)} • {itemCount} món •{' '}
                  <strong style={{ color: '#2e7d32' }}>
                    {order.total.toLocaleString('vi-VN')} đ
                  </strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.6rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link
                    href={`/orders/${order.id}`}
                    style={{
                      fontSize: '0.8rem',
                      color: '#0066cc',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Xem chi tiết →
                  </Link>
                  {canPay && (
                    <Link
                      href={`/payments?orderId=${order.id}`}
                      style={{
                        fontSize: '0.8rem',
                        color: '#2e7d32',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Thanh toán →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}