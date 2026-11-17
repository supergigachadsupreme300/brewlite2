'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './payment.module.css';

type DemoOrder = {
  orderId: string;
  description: string;
  amount: number;
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

function isPaymentResult(value: unknown): value is PaymentResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Record<string, unknown>;
  return (
    typeof result.paymentId === 'string' &&
    typeof result.orderId === 'string' &&
    (result.method === 'WALLET' || result.method === 'CARD') &&
    typeof result.amount === 'number' &&
    (result.status === 'SUCCESS' || result.status === 'FAILED') &&
    typeof result.idempotencyKey === 'string' &&
    typeof result.message === 'string'
  );
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentDemoPage() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('WALLET');
  const [mockOutcome, setMockOutcome] = useState<PaymentStatus>('SUCCESS');
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDemoOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/demo-orders`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Tải đơn demo thất bại (${response.status}).`);
        }

        const demoOrders = (await response.json()) as DemoOrder[];
        if (!Array.isArray(demoOrders)) {
          throw new Error('API trả về danh sách đơn demo không hợp lệ.');
        }

        setOrders(demoOrders);
        setSelectedOrderId(demoOrders[0]?.orderId ?? '');
      } catch (error) {
        if (!controller.signal.aborted) {
          setOrderError(
            error instanceof Error
              ? error.message
              : 'Không thể tải đơn demo.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingOrders(false);
        }
      }
    }

    void loadDemoOrders();
    return () => controller.abort();
  }, []);

  function resetAttempt() {
    setResult(null);
    setPaymentError(null);
    idempotencyKey.current = null;
  }

  async function submitPayment() {
    const order = orders.find((item) => item.orderId === selectedOrderId);
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
          orderId: order.orderId,
          method,
          idempotencyKey: idempotencyKey.current,
          mockOutcome,
        }),
      });
      const body = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        if (response.status < 500) {
          idempotencyKey.current = null;
        }
        const message = body.message;
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

  const selectedOrder = orders.find(
    (order) => order.orderId === selectedOrderId,
  );

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
            Chọn đơn, phương thức và kết quả để thử luồng thanh toán mô phỏng.
          </p>

          <section className={styles.section} aria-labelledby="order-heading">
            <h2 className={styles.sectionTitle} id="order-heading">
              Đơn hàng demo
            </h2>
            {isLoadingOrders && <p role="status">Đang tải đơn hàng...</p>}
            {orderError && (
              <p className={styles.error} role="alert">
                {orderError}
              </p>
            )}
            {!isLoadingOrders && !orderError && orders.length === 0 && (
              <p className={styles.muted}>Hiện chưa có đơn hàng demo.</p>
            )}
            {orders.length > 0 && (
              <div className={styles.choices} role="group" aria-label="Đơn hàng">
                {orders.map((order) => (
                  <button
                    className={`${styles.choice} ${styles.orderChoice} ${
                      selectedOrderId === order.orderId
                        ? styles.choiceSelected
                        : ''
                    }`}
                    key={order.orderId}
                    type="button"
                    disabled={isSubmitting}
                    aria-pressed={selectedOrderId === order.orderId}
                    onClick={() => {
                      setSelectedOrderId(order.orderId);
                      resetAttempt();
                    }}
                  >
                    <span>{order.orderId}</span>
                    <span className={styles.orderDescription}>
                      {order.description}
                    </span>
                    <span>{formatAmount(order.amount)}</span>
                  </button>
                ))}
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

          {selectedOrder && (
            <p className={styles.notice}>
              Demo sẽ xử lý {formatAmount(selectedOrder.amount)} bằng dữ liệu mẫu.
              Không nhập hoặc gửi số thẻ, CVV hay mật khẩu.
            </p>
          )}

          <button
            className={styles.submit}
            type="button"
            disabled={
              isLoadingOrders ||
              isSubmitting ||
              !selectedOrder ||
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
