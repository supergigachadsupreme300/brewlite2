import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentResult } from './payment.types';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Body() input: CreatePaymentDto): PaymentResult {
    return this.paymentsService.createPayment(input);
  }
}
