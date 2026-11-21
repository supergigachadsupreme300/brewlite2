import { Injectable } from '@nestjs/common';
import { PaymentStatus } from './payment.types';

@Injectable()
export class MockPaymentGateway {
  charge(outcome: PaymentStatus): PaymentStatus {
    return outcome;
  }
}
