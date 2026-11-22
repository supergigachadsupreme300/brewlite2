import { ConflictException, NotFoundException } from '@nestjs/common';
import { MockPaymentGateway } from '../../apps/api/src/payments/mock-payment.gateway';
import { PaymentsService } from '../../apps/api/src/payments/payments.service';
import { OrdersService } from '../../apps/api/src/orders/orders.service';
import { ProductsService } from '../../apps/api/src/products/products.service';
import {
  OrderStatus,
  PaymentMethod as OrderPaymentMethod,
  PickupType,
} from '../../apps/api/src/orders/order.entity';
import {
  CreatePaymentInput,
  PaymentMethod,
  PaymentStatus,
} from '../../apps/api/src/payments/payment.types';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let ordersService: OrdersService;

  beforeEach(() => {
    ordersService = new OrdersService(new ProductsService());
    service = new PaymentsService(new MockPaymentGateway(), ordersService);
  });

  const paymentInput = (
    orderId: string,
    overrides: Partial<CreatePaymentInput> = {},
  ): CreatePaymentInput => ({
    orderId,
    method: PaymentMethod.CARD,
    idempotencyKey: 'request-key-0001',
    mockOutcome: PaymentStatus.SUCCESS,
    ...overrides,
  });

  function createOrder() {
    return ordersService.createOrder({
      customerName: 'Payment Test User',
      customerPhone: '0901234567',
      pickupType: PickupType.TAKEAWAY,
      paymentMethod: OrderPaymentMethod.CARD,
      items: [{ productId: '1', quantity: 1 }],
    });
  }

  it('uses the server-side order total and marks the order paid on success', () => {
    const order = createOrder();
    const result = service.createPayment(paymentInput(order.id));

    expect(result).toMatchObject({
      orderId: order.id,
      amount: order.total,
      method: PaymentMethod.CARD,
      status: PaymentStatus.SUCCESS,
    });
    expect(ordersService.findOne(order.id).status).toBe(OrderStatus.PAID);
  });

  it('records a failed result and allows a new attempt with a new key', () => {
    const order = createOrder();
    const failed = service.createPayment(
      paymentInput(order.id, { mockOutcome: PaymentStatus.FAILED }),
    );
    const retried = service.createPayment(
      paymentInput(order.id, {
        idempotencyKey: 'request-key-0002',
        method: PaymentMethod.CARD,
      }),
    );

    expect(failed.status).toBe(PaymentStatus.FAILED);
    expect(retried.status).toBe(PaymentStatus.SUCCESS);
    expect(ordersService.findOne(order.id).status).toBe(OrderStatus.PAID);
  });

  it('returns the original result for an identical idempotent request', () => {
    const order = createOrder();
    const first = service.createPayment(paymentInput(order.id));
    const retry = service.createPayment(paymentInput(order.id));

    expect(retry).toEqual(first);
  });

  it('rejects reusing a key with different payment details', () => {
    const order = createOrder();
    service.createPayment(paymentInput(order.id));

    expect(() =>
      service.createPayment(
        paymentInput(order.id, { method: PaymentMethod.MOMO }),
      ),
    ).toThrow(ConflictException);
  });

  it('rejects a payment method different from the one selected on the order', () => {
    const order = createOrder();

    expect(() =>
      service.createPayment(
        paymentInput(order.id, {
          method: PaymentMethod.MOMO,
          idempotencyKey: 'request-key-0002',
        }),
      ),
    ).toThrow(ConflictException);
    expect(ordersService.findOne(order.id).status).toBe(OrderStatus.PENDING);
  });

  it('prevents a second successful payment for the same order', () => {
    const order = createOrder();
    service.createPayment(paymentInput(order.id));

    expect(() =>
      service.createPayment(
        paymentInput(order.id, { idempotencyKey: 'request-key-0002' }),
      ),
    ).toThrow(ConflictException);
  });

  it('rejects an order that does not exist', () => {
    expect(() =>
      service.createPayment(paymentInput('unknown-order')),
    ).toThrow(NotFoundException);
  });
});
