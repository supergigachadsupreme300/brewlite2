'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  toppings?: string[];
  unitPrice: number;
  lineTotal: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupType: 'TAKEAWAY' | 'DINE_IN';
  tableNumber?: string;
  paymentMethod: 'MOMO' | 'BANK_TRANSFER' | 'CARD';
  status:
    | 'PENDING'
    | 'PAID'
    | 'PREPARING'
    | 'READY'
    | 'COMPLETED'
    | 'PAYMENT_FAILED'
    | 'CANCELLED';
  items: OrderItem[];
  total: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getAccessToken(): string | null {
  return (
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('brewlite_jwt')
  );
}

const STATUS_MAP: Record<
  Order['status'],
  { label: string; bg: string; color: string; desc: string }
> = {
  PENDING: {
    label: 'Chờ thanh toán',
    bg: '#fff8e1',
    color: '#b78103',
    desc: 'Đơn hàng đã được tiếp nhận. Quý khách vui lòng hoàn tất thanh toán.',
  },
  PAID: {
    label: 'Đã thanh toán',
    bg: '#e8f5e9',
    color: '#2e7d32',
    desc: 'Thanh toán thành công. Đơn hàng đang được chuyển đến quầy pha chế.',
  },
  PREPARING: {
    label: 'Đang pha chế',
    bg: '#e3f2fd',
    color: '#1565c0',
    desc: 'Barista đang chuẩn bị đồ uống cho bạn.',
  },
  READY: {
    label: 'Sẵn sàng nhận món',
    bg: '#f3e5f5',
    color: '#7b1fa2',
    desc: 'Đồ uống đã chuẩn bị xong! Quý khách vui lòng đến quầy nhận món.',
  },
  COMPLETED: {
    label: 'Đã hoàn thành',
    bg: '#e0f2f1',
    color: '#00695c',
    desc: 'Đơn hàng đã phục vụ hoàn tất. Cảm ơn quý khách!',
  },
  PAYMENT_FAILED: {
    label: 'Thanh toán chưa thành công',
    bg: '#ffebee',
    color: '#c62828',
    desc: 'Giao dịch chưa hoàn tất. Quý khách vui lòng kiểm tra lại.',
  },
  CANCELLED: {
    label: 'Đơn hàng đã hủy',
    bg: '#eeeeee',
    color: '#616161',
    desc: 'Đơn hàng này đã bị hủy.',
  },
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        throw new Error('Không tìm thấy thông tin đơn hàng này.');
      }
      if (!res.ok) {
        throw new Error(`Lỗi tải đơn hàng: ${res.status}`);
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError((err as Error).message || 'Có lỗi xảy ra khi tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!id || cancelling) return;
    const confirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!confirmed) return;

    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Không thể hủy đơn hàng');
      }
      setOrder(data);
    } catch (err) {
      alert((err as Error).message || 'Có lỗi khi hủy đơn');
    } finally {
      setCancelling(false);
    }
  };

  const statusInfo = order ? STATUS_MAP[order.status] : null;

  return (
    <main
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <a
          href="/"
          style={{
            color: '#0066cc',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          ← Quay lại thực đơn
        </a>
        <a
          href="/checkout"
          style={{
            color: '#0066cc',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          + Đặt đơn mới
        </a>
      </div>

      {loading && <p role="status">Đang tải thông tin đơn hàng...</p>}

      {error && (
        <p role="alert" style={{ color: '#b00020' }}>
          {error}
        </p>
      )}

      {!loading && order && statusInfo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Banner thông báo đặt hàng thành công */}
          <div
            style={{
              backgroundColor: '#e8f5e9',
              border: '1px solid #c8e6c9',
              borderRadius: '0.75rem',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.5rem', color: '#2e7d32' }}>✓</span>
            <div>
              <div style={{ fontWeight: 700, color: '#2e7d32', fontSize: '0.95rem' }}>
                Đặt hàng thành công!
              </div>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>
                Cảm ơn quý khách đã đặt món tại BrewLite.
              </div>
            </div>
          </div>

          {/* Trạng thái đơn hàng */}
          <div
            style={{
              backgroundColor: statusInfo.bg,
              border: `1.5px solid ${statusInfo.color}`,
              borderRadius: '0.75rem',
              padding: '1.1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
              Mã đơn hàng: <strong style={{ color: '#222' }}>{order.id}</strong>
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: statusInfo.color,
                marginBottom: '0.35rem',
              }}
            >
              {statusInfo.label}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#444' }}>
              {statusInfo.desc}
            </div>
          </div>

          {/* Nút thanh toán dành cho khách hàng */}
          {order.status === 'PENDING' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => router.push(`/payments?orderId=${order.id}`)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2e7d32',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Thanh toán đơn hàng ({order.total.toLocaleString('vi-VN')} đ) →
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#ffffff',
                  color: '#666',
                  border: '1px solid #ccc',
                  borderRadius: '0.4rem',
                  fontSize: '0.85rem',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                }}
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            </div>
          )}

          {order.status === 'PAYMENT_FAILED' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => router.push(`/payments?orderId=${order.id}`)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2e7d32',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Thử thanh toán lại →
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#ffffff',
                  color: '#666',
                  border: '1px solid #ccc',
                  borderRadius: '0.4rem',
                  fontSize: '0.85rem',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                }}
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            </div>
          )}

          {/* Thông tin nhận hàng */}
          <section
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '0.75rem',
              padding: '1rem',
              backgroundColor: '#fafafa',
            }}
          >
            <h2 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
              Thông tin nhận hàng
            </h2>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              <div>
                <strong>Họ tên:</strong> {order.customerName}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {order.customerPhone}
              </div>
              <div>
                <strong>Hình thức:</strong>{' '}
                {order.pickupType === 'DINE_IN'
                  ? `Dùng tại quán (${order.tableNumber})`
                  : 'Mang đi'}
              </div>
              <div>
                <strong>Thanh toán:</strong>{' '}
                {order.paymentMethod === 'MOMO'
                  ? 'Ví MoMo'
                  : order.paymentMethod === 'BANK_TRANSFER'
                  ? 'Chuyển khoản VietQR'
                  : 'Thẻ quốc tế (Visa / Mastercard)'}
              </div>
              {order.note && (
                <div>
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}
            </div>
          </section>

          {/* Chi tiết đơn hàng */}
          <section
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '0.75rem',
              padding: '1rem',
            }}
          >
            <h2 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
              Món đã đặt ({order.items.length})
            </h2>
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <strong>{item.productName}</strong> x {item.quantity}{' '}
                  <span style={{ color: '#666' }}>
                     (Size {item.size || 'M'}
                     {item.toppings && item.toppings.length
                       ? ` • Topping: ${item.toppings.join(', ')}`
                       : ''}
                     )
                  </span>
                </div>
                <div style={{ fontWeight: 600 }}>{item.lineTotal.toLocaleString('vi-VN')} đ</div>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '1.05rem',
                marginTop: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '2px dashed #ddd',
              }}
            >
              <span>Tổng cộng:</span>
              <span style={{ color: '#2e7d32' }}>{order.total.toLocaleString('vi-VN')} đ</span>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
