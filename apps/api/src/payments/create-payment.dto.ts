import { IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PaymentMethod, PaymentStatus } from './payment.types';

export class CreatePaymentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  orderId!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/\S/)
  idempotencyKey!: string;

  @IsEnum(PaymentStatus)
  mockOutcome!: PaymentStatus;
}
