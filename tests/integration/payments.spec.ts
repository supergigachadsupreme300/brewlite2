import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';
import { PaymentMethod, PaymentStatus } from '../../apps/api/src/payments/payment.types';

describe('Payments API (mock demo)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists demo orders with server-owned amounts', async () => {
    const response = await request(app.getHttpServer())
      .get('/payments/demo-orders')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          orderId: 'demo-order-001',
          amount: 68000,
        }),
      ]),
    );
  });

  it('accepts a wallet payment and reuses the result for an identical key', async () => {
    const payment = {
      orderId: 'demo-order-001',
      method: PaymentMethod.WALLET,
      idempotencyKey: 'integration-key-0001',
      mockOutcome: PaymentStatus.SUCCESS,
    };

    const first = await request(app.getHttpServer())
      .post('/payments')
      .send(payment)
      .expect(201);
    const retry = await request(app.getHttpServer())
      .post('/payments')
      .send(payment)
      .expect(201);

    expect(first.body.status).toBe(PaymentStatus.SUCCESS);
    expect(first.body.amount).toBe(68000);
    expect(retry.body.paymentId).toBe(first.body.paymentId);
  });

  it('returns a failed card payment without reporting success', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments')
      .send({
        orderId: 'demo-order-002',
        method: PaymentMethod.CARD,
        idempotencyKey: 'integration-key-0002',
        mockOutcome: PaymentStatus.FAILED,
      })
      .expect(201);

    expect(response.body.status).toBe(PaymentStatus.FAILED);
    expect(response.body.method).toBe(PaymentMethod.CARD);
  });

  it('rejects invalid methods and client-supplied amounts', async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .send({
        orderId: 'demo-order-001',
        method: 'CASH',
        idempotencyKey: 'integration-key-0003',
        mockOutcome: PaymentStatus.SUCCESS,
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/payments')
      .send({
        orderId: 'demo-order-001',
        method: PaymentMethod.CARD,
        idempotencyKey: 'integration-key-0004',
        mockOutcome: PaymentStatus.SUCCESS,
        amount: 1,
      })
      .expect(400);
  });

  it('rejects a second successful payment using a new idempotency key', async () => {
    const baseRequest = {
      orderId: 'demo-order-002',
      method: PaymentMethod.WALLET,
      mockOutcome: PaymentStatus.SUCCESS,
    };

    await request(app.getHttpServer())
      .post('/payments')
      .send({ ...baseRequest, idempotencyKey: 'integration-key-0005' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/payments')
      .send({ ...baseRequest, idempotencyKey: 'integration-key-0006' })
      .expect(409);
  });
});
