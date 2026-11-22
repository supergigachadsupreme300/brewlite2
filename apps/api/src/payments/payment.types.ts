import { PaymentMethod } from '../orders/order.entity';

export { PaymentMethod } from '../orders/order.entity';

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface CreatePaymentInput {
  orderId: string;
  method: PaymentMethod;
  idempotencyKey: string;
  mockOutcome: PaymentStatus;
}

export interface PaymentResult {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  idempotencyKey: string;
  message: string;
}
