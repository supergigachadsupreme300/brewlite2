export enum PaymentMethod {
  WALLET = 'WALLET',
  CARD = 'CARD',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface DemoOrder {
  orderId: string;
  description: string;
  amount: number;
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
