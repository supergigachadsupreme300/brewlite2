import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentResult } from './payment.types';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('payments')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(
    @Body() input: CreatePaymentDto,
    @Req() req?: { user?: { id: string } },
  ): PaymentResult {
    return this.paymentsService.createPayment(input, req?.user?.id);
  }
}
