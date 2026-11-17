import { ConflictException, NotFoundException } from '@nestjs/common';
import { MockPaymentGateway } from '../../apps/api/src/payments/mock-payment.gateway';
import { PaymentsService } from '../../apps/api/src/payments/payments.service';
import {
  CreatePaymentInput,
  PaymentMethod,
  PaymentStatus,
} from '../../apps/api/src/payments/payment.types';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(() => {
    service = new PaymentsService(new MockPaymentGateway());
  });

  const paymentInput = (
    overrides: Partial<CreatePaymentInput> = {},
  ): CreatePaymentInput => ({
    orderId: 'demo-order-001',
    method: PaymentMethod.WALLET,
    idempotencyKey: 'request-key-0001',
    mockOutcome: PaymentStatus.SUCCESS,
    ...overrides,
  });

  it('uses the server-side demo order amount and returns a successful result', () => {
    const result = service.createPayment(paymentInput());

    expect(result).toMatchObject({
      orderId: 'demo-order-001',
      amount: 68000,
      method: PaymentMethod.WALLET,
      status: PaymentStatus.SUCCESS,
    });
  });

  it('records a failed result and allows a new attempt with a new key', () => {
    const failed = service.createPayment(
      paymentInput({ mockOutcome: PaymentStatus.FAILED }),
    );
    const retried = service.createPayment(
      paymentInput({
        idempotencyKey: 'request-key-0002',
        method: PaymentMethod.CARD,
      }),
    );

    expect(failed.status).toBe(PaymentStatus.FAILED);
    expect(retried.status).toBe(PaymentStatus.SUCCESS);
  });

  it('returns the original result for an identical idempotent request', () => {
    const first = service.createPayment(paymentInput());
    const retry = service.createPayment(paymentInput());

    expect(retry).toEqual(first);
  });

  it('rejects reusing a key with different payment details', () => {
    service.createPayment(paymentInput());

    expect(() =>
      service.createPayment(
        paymentInput({ method: PaymentMethod.CARD }),
      ),
    ).toThrow(ConflictException);
  });

  it('prevents a second successful payment for the same demo order', () => {
    service.createPayment(paymentInput());

    expect(() =>
      service.createPayment(paymentInput({ idempotencyKey: 'request-key-0002' })),
    ).toThrow(ConflictException);
  });

  it('rejects an order that is not in the demo fixtures', () => {
    expect(() =>
      service.createPayment(paymentInput({ orderId: 'unknown-order' })),
    ).toThrow(NotFoundException);
  });
});
