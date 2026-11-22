import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
  passwordSalt: string;
}

@Injectable()
export class AuthService {
  private readonly users: StoredUser[] = [];
  private readonly secret: string =
    process.env.JWT_SECRET ?? 'brewlite-dev-secret';

  register(name: string, email: string, password: string): {
    user: AuthUser;
    accessToken: string;
  } {
    if (!name || name.trim().length < 2) {
      throw new BadRequestException('Tên phải có ít nhất 2 ký tự');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Email không hợp lệ');
    }
    if (!password || password.length < 6) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (this.users.some((u) => u.email === normalizedEmail)) {
      throw new BadRequestException('Email đã được đăng ký');
    }

    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');

    const user: StoredUser = {
      id: `user-${Date.now()}-${randomBytes(4).toString('hex')}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hash,
      passwordSalt: salt,
    };
    this.users.push(user);

    const accessToken = this.signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    return { user: this.toPublic(user), accessToken };
  }

  login(email: string, password: string): {
    user: AuthUser;
    accessToken: string;
  } {
    if (!email || !password) {
      throw new BadRequestException('Email và mật khẩu là bắt buộc');
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email === normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const hash = scryptSync(password, user.passwordSalt, 64);
    const stored = Buffer.from(user.passwordHash, 'hex');
    if (hash.length !== stored.length || !timingSafeEqual(hash, stored)) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const accessToken = this.signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    return { user: this.toPublic(user), accessToken };
  }

  verifyToken(token: string): AuthUser {
    const payload = this.decodeAndVerify(token);
    const user = this.users.find((u) => u.id === payload.sub);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    return this.toPublic(user);
  }

  private signToken(payload: Record<string, unknown>): string {
    const header = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const body = this.base64UrlEncode(
      JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      }),
    );
    const signature = this.hmac(`${header}.${body}`);
    return `${header}.${body}.${signature}`;
  }

  private decodeAndVerify(token: string): {
    sub: string;
    email: string;
    name: string;
    exp: number;
  } {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    const expected = this.hmac(`${parts[0]}.${parts[1]}`);
    if (!this.safeCompare(expected, parts[2])) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    let payload: { sub: string; email: string; name: string; exp: number };
    try {
      payload = JSON.parse(this.base64UrlDecode(parts[1]));
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token đã hết hạn');
    }
    return payload;
  }

  private hmac(data: string): string {
    return createHmac('sha256', this.secret)
      .update(data)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private base64UrlDecode(value: string): string {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    return Buffer.from(padded + pad, 'base64').toString('utf8');
  }

  private toPublic(user: StoredUser): AuthUser {
    return { id: user.id, name: user.name, email: user.email };
  }
}