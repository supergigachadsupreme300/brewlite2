import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization;
    if (header && header.startsWith('Bearer ')) {
      try {
        const token = header.slice(7).trim();
        request.user = this.authService.verifyToken(token);
      } catch {
        request.user = undefined;
      }
    } else {
      request.user = undefined;
    }
    return true;
  }
}