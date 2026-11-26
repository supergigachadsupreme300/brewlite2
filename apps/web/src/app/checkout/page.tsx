'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  toppings?: string[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const SAMPLE_ITEMS: CartItem[] = [
  { productId: '1', name: 'Espresso', price: 2.5, quantity: 1, size: 'M' },
  { productId: '2', name: 'Americano', price: 3.0, quantity: 2, size: 'L' },
];

export default function CheckoutPage() {
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

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;
    if (!token) return;
    fetch(`${API_BASE_URL}/auth/loyalty`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.points === 'number') setLoyaltyPoints(data.points);
      })
      .catch(() => {});
  }, []);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [pickupType, setPickupType] = useState<'TAKEAWAY' | 'DINE_IN'>('TAKEAWAY');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'BANK_TRANSFER' | 'CARD'>('MOMO');
  const [note, setNote] = useState<string>('');

  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [redeemPoints, setRedeemPoints] = useState<number>(0);

  const [touchedPhone, setTouchedPhone] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lấy giỏ hàng từ bộ nhớ trình duyệt
  useEffect(() => {
    try {
      const stored = localStorage.getItem('brewlite_cart');
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const finalTotal = Math.max(0, subtotal - promoDiscount);

  const phoneRegex = /^0[0-9]{9}$/;
  const isPhoneValid = phoneRegex.test(customerPhone.trim());
  const isNameValid = customerName.trim().length >= 2;
  const isTableValid =
    pickupType === 'TAKEAWAY' || tableNumber.trim().length > 0;
  const isCartValid = cart.length > 0;

  const canSubmit = isNameValid && isPhoneValid && isTableValid && isCartValid && !submitting;

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      try {
        localStorage.setItem('brewlite_cart', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const next = prev.filter((item) => item.productId !== productId);
      try {
        localStorage.setItem('brewlite_cart', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const loadSampleCart = () => {
    setCart(SAMPLE_ITEMS);
    try {
      localStorage.setItem('brewlite_cart', JSON.stringify(SAMPLE_ITEMS));
    } catch {}
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'BREWLITE' || code === 'SALE20') {
      const discount = 1.0;
      setAppliedPromo(code);
      setPromoDiscount(discount);
      setPromoMessage(`Áp dụng mã ${code} thành công (-$${discount.toFixed(2)})`);
    } else if (code === '') {
      setAppliedPromo(null);
      setPromoDiscount(0);
      setPromoMessage(null);
    } else {
      setAppliedPromo(null);
      setPromoDiscount(0);
      setPromoMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      pickupType,
      tableNumber: pickupType === 'DINE_IN' ? tableNumber.trim() : undefined,
      paymentMethod,
      promoCode: appliedPromo || undefined,
      redeemPoints: redeemPoints > 0 ? redeemPoints : undefined,
      note: note.trim()
        ? `${note.trim()}${appliedPromo ? ` [Mã ưu đãi: ${appliedPromo}]` : ''}`
        : appliedPromo
        ? `[Mã ưu đãi: ${appliedPromo}]`
        : undefined,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size || 'M',
        toppings: item.toppings && item.toppings.length ? [...item.toppings] : undefined,
      })),
    };

    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('token') || localStorage.getItem('brewlite_jwt')
          : null;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Không thể tạo đơn hàng');
      }

      try {
        localStorage.removeItem('brewlite_cart');
      } catch {}

      router.push(`/orders/${data.id}`);
    } catch (err) {
      setErrorMessage(
        (err as Error).message || 'Có lỗi xảy ra khi gửi yêu cầu đặt món.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: '480px',
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

      <h1 style={{ fontSize: '1.4rem', margin: '0 0 1rem 0', fontWeight: 700 }}>
        Thanh toán đơn hàng
      </h1>

      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: '#ffebee',
            color: '#b00020',
            border: '1px solid #ef9a9a',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Danh sách món đã chọn */}
      <section
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fafafa',
        }}
      >
        <h2 style={{ fontSize: '1.05rem', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
          Món đã chọn ({cart.length})
        </h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
            <p style={{ color: '#666', margin: '0 0 0.75rem 0' }}>
              Giỏ hàng của bạn đang trống.
            </p>
            <button
              type="button"
              onClick={loadSampleCart}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ccc',
                padding: '0.45rem 0.9rem',
                borderRadius: '0.4rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              + Thêm món gợi ý vào giỏ
            </button>
          </div>
        ) : (
          <div>
            {cart.map((item) => {
              const lineTotal = item.price * item.quantity;
              return (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                      Size {item.size || 'M'} • ${item.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#2e7d32', marginTop: '2px', fontWeight: 600 }}>
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                      }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      title="Xóa món"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#999',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        marginLeft: '0.4rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Mã giảm giá */}
            <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed #ddd' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá (vd: BREWLITE)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.6rem',
                    fontSize: '0.85rem',
                    borderRadius: '0.4rem',
                    border: '1px solid #ccc',
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.85rem',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '0.4rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Áp dụng
                </button>
              </div>
              {promoMessage && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    marginTop: '0.35rem',
                    color: appliedPromo ? '#2e7d32' : '#b00020',
                  }}
                >
                  {promoMessage}
                </div>
              )}
            </div>

            {/* Bảng tính tiền */}
            <div
              style={{
                marginTop: '0.8rem',
                paddingTop: '0.6rem',
                borderTop: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555' }}>
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#2e7d32' }}>
                  <span>Giảm giá ({appliedPromo}):</span>
                  <span>-{promoDiscount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginTop: '0.2rem',
                }}
              >
                <span>Tổng cộng:</span>
                <span style={{ color: '#2e7d32' }}>{finalTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Thông tin giao nhận & thanh toán */}
      <form onSubmit={handleSubmit}>
        <section
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', margin: '0', fontWeight: 600 }}>
            Thông tin nhận hàng
          </h2>

          <div>
            <label
              htmlFor="customerName"
              style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}
            >
              Họ và tên *
            </label>
            <input
              id="customerName"
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.4rem',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="customerPhone"
              style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}
            >
              Số điện thoại *
            </label>
            <input
              id="customerPhone"
              type="tel"
              placeholder="Ví dụ: 0901234567"
              value={customerPhone}
              onBlur={() => setTouchedPhone(true)}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.4rem',
                border:
                  touchedPhone && !isPhoneValid
                    ? '1.5px solid #b00020'
                    : '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
            {touchedPhone && !isPhoneValid && (
              <span style={{ color: '#b00020', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.
              </span>
            )}
          </div>

          <div>
            <label
              style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}
            >
              Hình thức nhận *
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="pickupType"
                  value="TAKEAWAY"
                  checked={pickupType === 'TAKEAWAY'}
                  onChange={() => setPickupType('TAKEAWAY')}
                />
                Mang đi
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="pickupType"
                  value="DINE_IN"
                  checked={pickupType === 'DINE_IN'}
                  onChange={() => setPickupType('DINE_IN')}
                />
                Dùng tại quán
              </label>
            </div>
          </div>

          {pickupType === 'DINE_IN' && (
            <div>
              <label
                htmlFor="tableNumber"
                style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}
              >
                Số bàn ngồi *
              </label>
              <input
                id="tableNumber"
                type="text"
                placeholder="Ví dụ: Bàn 08"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required={pickupType === 'DINE_IN'}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.4rem',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}
            >
              Phương thức thanh toán *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MOMO"
                  checked={paymentMethod === 'MOMO'}
                  onChange={() => setPaymentMethod('MOMO')}
                />
                Ví điện tử MoMo
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                />
                Chuyển khoản VietQR
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                />
                Thẻ quốc tế (Visa / Mastercard)
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="note"
              style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}
            >
              Ghi chú thêm
            </label>
            <input
              id="note"
              type="text"
              placeholder="Ví dụ: Ít đường, nhiều đá..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.4rem',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </section>

        {loyaltyPoints > 0 && (
          <section
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#fafafa',
            }}
          >
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
              Điểm thưởng: {loyaltyPoints} điểm
            </h2>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
              Dùng điểm (1 điểm = 1.000đ)
            </label>
            <input
              type="number"
              min={0}
              max={loyaltyPoints}
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.4rem',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </section>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '0.8rem',
            backgroundColor: canSubmit ? '#2e7d32' : '#cccccc',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
        >
          {submitting ? 'Đang xử lý...' : `Đặt hàng ngay • ${finalTotal.toLocaleString('vi-VN')} đ`}
        </button>
      </form>
    </main>
  );
}
