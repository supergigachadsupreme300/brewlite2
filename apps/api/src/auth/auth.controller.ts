import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: { user: unknown }) {
    return req.user;
  }

  @Get('loyalty')
  @UseGuards(AuthGuard)
  loyalty(@Req() req: { user: { id: string } }) {
    return {
      points: this.authService.getLoyaltyPoints(req.user.id),
      history: this.authService.getLoyaltyHistory(req.user.id),
    };
  }

  @Post('loyalty/redeem')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  redeem(@Body() body: { points: number }, @Req() req: { user: { id: string } }) {
    const ok = this.authService.redeemLoyaltyPoints(req.user.id, body.points);
    if (!ok) {
      throw new BadRequestException('Không đủ điểm để đổi');
    }
    return { success: true, points: this.authService.getLoyaltyPoints(req.user.id) };
  }
}