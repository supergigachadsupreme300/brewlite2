import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu token xác thực');
    }
    const token = header.slice(7).trim();
    const user = this.authService.verifyToken(token);
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Chỉ admin mới có quyền thực hiện thao tác này');
    }
    request.user = user;
    return true;
  }
}