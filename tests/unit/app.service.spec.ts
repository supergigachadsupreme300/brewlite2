import { AppService } from '../../apps/api/src/app.service';

describe('AppService', () => {
  it('returns health status', () => {
    const service = new AppService();
    expect(service.getHealth()).toEqual({
      status: 'ok',
      service: 'brewlite-api',
    });
  });
});