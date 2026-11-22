import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';
import {
  OrderStatus,
  PaymentMethod as OrderPaymentMethod,
  PickupType,
} from '../../apps/api/src/orders/order.entity';
import { PaymentMethod, PaymentStatus } from '../../apps/api/src/payments/payment.types';

jest.setTimeout(60000);

describe('Payments API (mock)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Pay Tester', email: 'pay-tester@example.com', password: 'secret123' });
    token = reg.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  function auth() {
    return { Authorization: `Bearer ${token}` };
  }

  async function createOrder() {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .set(auth())
      .send({
        customerName: 'Payment Integration User',
        customerPhone: '0901234567',
        pickupType: PickupType.TAKEAWAY,
        paymentMethod: OrderPaymentMethod.CARD,
        items: [{ productId: '1', quantity: 1 }],
      })
      .expect(201);

    return response.body as { id: string; total: number };
  }

  it('pays a real order using its server-side total and reuses an identical request', async () => {
    const order = await createOrder();
    const payment = {
      orderId: order.id,
      method: PaymentMethod.WALLET,
      idempotencyKey: 'integration-key-0001',
      mockOutcome: PaymentStatus.SUCCESS,
    };

    const first = await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send(payment)
      .expect(201);
    const retry = await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send(payment)
      .expect(201);

    expect(first.body.status).toBe(PaymentStatus.SUCCESS);
    expect(first.body.amount).toBe(order.total);
    expect(retry.body.paymentId).toBe(first.body.paymentId);

    const updatedOrder = await request(app.getHttpServer())
      .get(`/orders/${order.id}`)
      .set(auth())
      .expect(200);
    expect(updatedOrder.body.status).toBe(OrderStatus.PAID);
  });

  it('records a failed payment on the order and permits a successful retry', async () => {
    const order = await createOrder();
    const failed = await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: order.id,
        method: PaymentMethod.CARD,
        idempotencyKey: 'integration-key-0002',
        mockOutcome: PaymentStatus.FAILED,
      })
      .expect(201);

    expect(failed.body.status).toBe(PaymentStatus.FAILED);

    const failedOrder = await request(app.getHttpServer())
      .get(`/orders/${order.id}`)
      .set(auth())
      .expect(200);
    expect(failedOrder.body.status).toBe(OrderStatus.PAYMENT_FAILED);

    await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: order.id,
        method: PaymentMethod.CARD,
        idempotencyKey: 'integration-key-0003',
        mockOutcome: PaymentStatus.SUCCESS,
      })
      .expect(201);

    const paidOrder = await request(app.getHttpServer())
      .get(`/orders/${order.id}`)
      .set(auth())
      .expect(200);
    expect(paidOrder.body.status).toBe(OrderStatus.PAID);
  });

  it('rejects invalid methods and client-supplied amounts', async () => {
    const order = await createOrder();
    await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: order.id,
        method: 'CASH',
        idempotencyKey: 'integration-key-0003',
        mockOutcome: PaymentStatus.SUCCESS,
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: order.id,
        method: PaymentMethod.CARD,
        idempotencyKey: 'integration-key-0004',
        mockOutcome: PaymentStatus.SUCCESS,
        amount: 1,
      })
      .expect(400);
  });

  it('rejects a second successful payment for the same order', async () => {
    const order = await createOrder();

    await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: order.id,
        method: PaymentMethod.WALLET,
        mockOutcome: PaymentStatus.SUCCESS,
        idempotencyKey: 'integration-key-0005',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: order.id,
        method: PaymentMethod.WALLET,
        mockOutcome: PaymentStatus.SUCCESS,
        idempotencyKey: 'integration-key-0006',
      })
      .expect(409);
  });

  it('rejects a payment for an order that does not exist', async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId: 'missing-order',
        method: PaymentMethod.CARD,
        idempotencyKey: 'integration-key-0007',
        mockOutcome: PaymentStatus.SUCCESS,
      })
      .expect(404);
  });
});
