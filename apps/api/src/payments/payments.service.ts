import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { OrderStatus } from '../orders/order.entity';
import { OrdersService } from '../orders/orders.service';
import { MockPaymentGateway } from './mock-payment.gateway';
import {
  CreatePaymentInput,
  PaymentResult,
  PaymentStatus,
} from './payment.types';

@Injectable()
export class PaymentsService {
  private readonly paymentsByKey = new Map<string, PaymentResult>();
  private nextPaymentId = 1;

  constructor(
    private readonly mockPaymentGateway: MockPaymentGateway,
    private readonly ordersService: OrdersService,
  ) {}

  createPayment(input: CreatePaymentInput, userId?: string): PaymentResult {
    const order = this.ordersService.findOne(input.orderId, userId);
    if (userId && order.userId && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thanh toán đơn hàng này');
    }

    if (input.method !== order.paymentMethod) {
      throw new ConflictException(
        'Phương thức thanh toán phải khớp với phương thức đã chọn cho đơn hàng',
      );
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

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PAYMENT_FAILED
    ) {
      throw new ConflictException('This order cannot be paid in its current state');
    }

    const status = this.mockPaymentGateway.charge(input.mockOutcome);
    if (status === PaymentStatus.SUCCESS) {
      this.ordersService.updateStatus(order.id, OrderStatus.PAID);
    } else if (order.status === OrderStatus.PENDING) {
      this.ordersService.updateStatus(order.id, OrderStatus.PAYMENT_FAILED);
    }

    const payment: PaymentResult = {
      paymentId: `payment-${this.nextPaymentId}`,
      orderId: order.id,
      method: input.method,
      amount: order.total,
      status,
      idempotencyKey: input.idempotencyKey,
      message:
        status === PaymentStatus.SUCCESS
          ? 'Thanh toán mô phỏng thành công.'
          : 'Thanh toán mô phỏng thất bại. Bạn có thể thử lại bằng yêu cầu mới.',
    };

    this.nextPaymentId += 1;
    this.paymentsByKey.set(input.idempotencyKey, payment);

    return { ...payment };
  }
}
