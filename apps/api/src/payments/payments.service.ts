import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MockPaymentGateway } from './mock-payment.gateway';
import { CreatePaymentInput, DemoOrder, PaymentResult, PaymentStatus } from './payment.types';
import { DEMO_ORDERS } from './payments.seed';

@Injectable()
export class PaymentsService {
  private readonly orders = new Map(
    DEMO_ORDERS.map((order) => [order.orderId, order]),
  );
  private readonly paymentsByKey = new Map<string, PaymentResult>();
  private readonly successfulPaymentByOrder = new Map<string, PaymentResult>();
  private nextPaymentId = 1;

  constructor(private readonly mockPaymentGateway: MockPaymentGateway) {}

  findDemoOrders(): DemoOrder[] {
    return DEMO_ORDERS.map((order) => ({ ...order }));
  }

  createPayment(input: CreatePaymentInput): PaymentResult {
    const order = this.orders.get(input.orderId);
    if (!order) {
      throw new NotFoundException(`Demo order "${input.orderId}" was not found`);
    }

    const existingPayment = this.paymentsByKey.get(input.idempotencyKey);
    if (existingPayment) {
      if (
        existingPayment.orderId !== input.orderId ||
        existingPayment.method !== input.method ||
        existingPayment.status !== input.mockOutcome
      ) {
        throw new ConflictException(
          'The idempotency key was already used for a different payment request',
        );
      }

      return { ...existingPayment };
    }

    if (this.successfulPaymentByOrder.has(input.orderId)) {
      throw new ConflictException('This demo order has already been paid');
    }

    const status = this.mockPaymentGateway.charge(input.mockOutcome);
    const payment: PaymentResult = {
      paymentId: `demo-payment-${this.nextPaymentId}`,
      orderId: order.orderId,
      method: input.method,
      amount: order.amount,
      status,
      idempotencyKey: input.idempotencyKey,
      message:
        status === PaymentStatus.SUCCESS
          ? 'Thanh toán mô phỏng thành công.'
          : 'Thanh toán mô phỏng thất bại. Bạn có thể thử lại bằng yêu cầu mới.',
    };

    this.nextPaymentId += 1;
    this.paymentsByKey.set(input.idempotencyKey, payment);
    if (status === PaymentStatus.SUCCESS) {
      this.successfulPaymentByOrder.set(input.orderId, payment);
    }

    return { ...payment };
  }
}
