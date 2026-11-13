import { AppService } from './app.service';

describe('AppService', () => {
  it('returns health status', () => {
    const service = new AppService();
    expect(service.getHealth()).toEqual({
      status: 'fail',
      service: 'brewlite-api',
    });
  });
});