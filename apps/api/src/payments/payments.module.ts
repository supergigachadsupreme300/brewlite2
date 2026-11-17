import { Module } from '@nestjs/common';
import { MockPaymentGateway } from './mock-payment.gateway';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [MockPaymentGateway, PaymentsService],
})
export class PaymentsModule {}
