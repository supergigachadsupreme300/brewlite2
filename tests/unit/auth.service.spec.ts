import { AuthService } from '../../apps/api/src/auth/auth.service';

describe('AuthService (Unit Tests)', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('registers a new user and returns a token', () => {
    const result = service.register('Test User', 'test@example.com', 'secret123');
    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBeTruthy();
    expect(result.accessToken.split('.').length).toBe(3);
  });

  it('rejects duplicate email registration', () => {
    service.register('Test User', 'dup@example.com', 'secret123');
    expect(() => service.register('Other', 'dup@example.com', 'secret123')).toThrow();
  });

  it('rejects invalid registration input', () => {
    expect(() => service.register('A', 'bad', '123')).toThrow();
  });

  it('logs in with correct credentials', () => {
    service.register('Test User', 'login@example.com', 'secret123');
    const result = service.login('login@example.com', 'secret123');
    expect(result.accessToken).toBeTruthy();
    const user = service.verifyToken(result.accessToken);
    expect(user.email).toBe('login@example.com');
  });

  it('rejects login with wrong password', () => {
    service.register('Test User', 'wrong@example.com', 'secret123');
    expect(() => service.login('wrong@example.com', 'badpass')).toThrow();
  });

  it('rejects invalid token', () => {
    expect(() => service.verifyToken('not.a.token')).toThrow();
  });
});