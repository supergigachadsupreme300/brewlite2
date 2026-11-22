'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './payment.module.css';

type PaymentOrder = {
  id: string;
  total: number;
  status:
    | 'PENDING'
    | 'PAYMENT_FAILED'
    | 'PAID'
    | 'PREPARING'
    | 'READY'
    | 'COMPLETED'
    | 'CANCELLED';
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
  }>;
};

type PaymentMethod = 'WALLET' | 'CARD';
type PaymentStatus = 'SUCCESS' | 'FAILED';

type PaymentResult = {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  idempotencyKey: string;
  message: string;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
).replace(/\/$/, '');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPaymentOrderItem(
  value: unknown,
): value is PaymentOrder['items'][number] {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.productName === 'string' &&
    typeof value.quantity === 'number'
  );
}

function isPaymentOrder(value: unknown): value is PaymentOrder {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.total === 'number' &&
    (value.status === 'PENDING' ||
      value.status === 'PAYMENT_FAILED' ||
      value.status === 'PAID' ||
      value.status === 'PREPARING' ||
      value.status === 'READY' ||
      value.status === 'COMPLETED' ||
      value.status === 'CANCELLED') &&
    Array.isArray(value.items) &&
    value.items.every(isPaymentOrderItem)
  );
}

function isPaymentResult(value: unknown): value is PaymentResult {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.paymentId === 'string' &&
    typeof value.orderId === 'string' &&
    (value.method === 'WALLET' || value.method === 'CARD') &&
    typeof value.amount === 'number' &&
    (value.status === 'SUCCESS' || value.status === 'FAILED') &&
    typeof value.idempotencyKey === 'string' &&
    typeof value.message === 'string'
  );
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function PaymentsPage() {
  const router = useRouter();
  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('brewlite_jwt')
        : null;
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('WALLET');
  const [mockOutcome, setMockOutcome] = useState<PaymentStatus>('SUCCESS');
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const orderId = new URLSearchParams(window.location.search).get('orderId');

    async function loadOrder() {
      if (!orderId) {
        setOrderError('Thiếu mã đơn hàng cần thanh toán.');
        setIsLoadingOrder(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Không tìm thấy đơn hàng.'
              : `Tải đơn hàng thất bại (${response.status}).`,
          );
        }

        const body: unknown = await response.json();
        if (!isPaymentOrder(body)) {
          throw new Error('API trả về thông tin đơn hàng không hợp lệ.');
        }

        setOrder(body);
      } catch (error) {
        if (!controller.signal.aborted) {
          setOrderError(
            error instanceof Error
              ? error.message
              : 'Không thể tải đơn hàng.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingOrder(false);
        }
      }
    }

    void loadOrder();
    return () => controller.abort();
  }, []);

  function resetAttempt() {
    setResult(null);
    setPaymentError(null);
    idempotencyKey.current = null;
  }

  async function submitPayment() {
    if (!order || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);
    idempotencyKey.current ??= crypto.randomUUID();

    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          method,
          idempotencyKey: idempotencyKey.current,
          mockOutcome,
        }),
      });
      const body: unknown = await response.json();

      if (!response.ok) {
        if (response.status < 500) {
          idempotencyKey.current = null;
        }
        const message = isRecord(body) ? body.message : undefined;
        throw new Error(
          Array.isArray(message)
            ? message.join(', ')
            : typeof message === 'string'
              ? message
              : `Thanh toán không thực hiện được (${response.status}).`,
        );
      }

      if (!isPaymentResult(body)) {
        throw new Error('API trả về kết quả thanh toán không hợp lệ.');
      }

      setResult(body);
      idempotencyKey.current = null;
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Không thể gửi yêu cầu thanh toán.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const canPay =
    order?.status === 'PENDING' || order?.status === 'PAYMENT_FAILED';

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} href="/">
          ← BrewLite
        </Link>

        <section className={styles.card} aria-labelledby="payment-title">
          <p className={styles.eyebrow}>BrewLite · Demo</p>
          <h1 className={styles.title} id="payment-title">
            Thanh toán đơn hàng
          </h1>
          <p className={styles.description}>
            Chọn phương thức và kết quả để thử thanh toán mô phỏng cho đơn hàng.
          </p>

          <section className={styles.section} aria-labelledby="order-heading">
            <h2 className={styles.sectionTitle} id="order-heading">
              Đơn hàng
            </h2>
            {isLoadingOrder && <p role="status">Đang tải đơn hàng...</p>}
            {orderError && (
              <p className={styles.error} role="alert">
                {orderError}
              </p>
            )}
            {!isLoadingOrder && !orderError && order && (
              <div className={styles.orderChoice}>
                <strong>{order.id}</strong>
                <div className={styles.orderDescription}>
                  {order.items
                    .map((item) => `${item.productName} × ${item.quantity}`)
                    .join(', ')}
                </div>
                <strong>{formatAmount(order.total)}</strong>
                {!canPay && (
                  <p className={styles.muted}>
                    Đơn hàng không còn ở trạng thái chờ thanh toán.
                  </p>
                )}
              </div>
            )}
          </section>

          <section className={styles.section} aria-labelledby="method-heading">
            <h2 className={styles.sectionTitle} id="method-heading">
              Phương thức thanh toán
            </h2>
            <div className={styles.choices} role="group" aria-label="Phương thức">
              {([
                ['WALLET', 'Ví điện tử'],
                ['CARD', 'Thẻ'],
              ] as const).map(([value, label]) => (
                <button
                  className={`${styles.choice} ${
                    method === value ? styles.choiceSelected : ''
                  }`}
                  key={value}
                  type="button"
                  disabled={isSubmitting}
                  aria-pressed={method === value}
                  onClick={() => {
                    setMethod(value);
                    resetAttempt();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="outcome-heading">
            <h2 className={styles.sectionTitle} id="outcome-heading">
              Kết quả mô phỏng
            </h2>
            <div className={styles.choices} role="group" aria-label="Kết quả demo">
              {([
                ['SUCCESS', 'Thành công'],
                ['FAILED', 'Thất bại'],
              ] as const).map(([value, label]) => (
                <button
                  className={`${styles.choice} ${
                    mockOutcome === value ? styles.choiceSelected : ''
                  }`}
                  key={value}
                  type="button"
                  disabled={isSubmitting}
                  aria-pressed={mockOutcome === value}
                  onClick={() => {
                    setMockOutcome(value);
                    resetAttempt();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {order && (
            <p className={styles.notice}>
              Demo sẽ xử lý {formatAmount(order.total)} lấy từ đơn hàng trên hệ
              thống. Không nhập hoặc gửi số thẻ, CVV hay mật khẩu.
            </p>
          )}

          <button
            className={styles.submit}
            type="button"
            disabled={
              isLoadingOrder ||
              isSubmitting ||
              !canPay ||
              Boolean(orderError)
            }
            onClick={() => void submitPayment()}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán demo'}
          </button>

          {paymentError && (
            <p className={`${styles.message} ${styles.failure}`} role="alert">
              {paymentError}
              {idempotencyKey.current &&
                ' Có thể gửi lại cùng yêu cầu bằng nút thanh toán.'}
            </p>
          )}

          {result && (
            <div
              className={`${styles.message} ${
                result.status === 'SUCCESS' ? styles.success : styles.failure
              }`}
              role={result.status === 'SUCCESS' ? 'status' : 'alert'}
            >
              <strong>
                {result.status === 'SUCCESS'
                  ? 'Thanh toán thành công'
                  : 'Thanh toán thất bại'}
              </strong>
              <div>{result.message}</div>
              <div>Mã giao dịch: {result.paymentId}</div>
              <Link href={`/orders/${result.orderId}`}>
                Xem trạng thái đơn hàng
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
