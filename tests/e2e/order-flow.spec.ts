import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';

jest.setTimeout(60000);

describe('E2E: Menu -> Order -> Payment -> Confirmation', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new (require('@nestjs/common').ValidationPipe)({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'E2E User', email: 'e2e@example.com', password: 'secret123' });
    token = reg.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  function auth() {
    return { Authorization: `Bearer ${token}` };
  }

  it('health check returns ok', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok', service: 'brewlite-api' });
  });

  it('menu: GET /products returns a non-empty list', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('product detail: GET /products/:id returns the product', async () => {
    const res = await request(app.getHttpServer()).get('/products/1').expect(200);
    expect(res.body.id).toBe('1');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('price');
    expect(res.body).toHaveProperty('stock');
    expect(res.body).toHaveProperty('isAvailable');
  });

  it('order: creates an order from cart items', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .set(auth())
      .send({
        customerName: 'E2E Customer',
        customerPhone: '0901234567',
        pickupType: 'TAKEAWAY',
        paymentMethod: 'MOMO',
        items: [{ productId: '1', quantity: 1, size: 'L', toppings: ['Extra shot'] }],
      })
      .expect(201);

    expect(res.body.id).toBeTruthy();
    expect(res.body.status).toBe('PENDING');
    // store for next tests
    (global as any).__e2eOrderId = res.body.id;
    (global as any).__e2eOrderTotal = res.body.total;
  });

  it('payment: pays the order successfully', async () => {
    const orderId = (global as any).__e2eOrderId;
    const res = await request(app.getHttpServer())
      .post('/payments')
      .set(auth())
      .send({
        orderId,
        method: 'MOMO',
        idempotencyKey: `e2e-key-${Date.now()}`,
        mockOutcome: 'SUCCESS',
      })
      .expect(201);

    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.orderId).toBe(orderId);
  });

  it('confirmation: order status is PAID after payment', async () => {
    const orderId = (global as any).__e2eOrderId;
    const res = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set(auth())
      .expect(200);

    expect(res.body.id).toBe(orderId);
    expect(res.body.status).toBe('PAID');
    expect(res.body.items[0].size).toBe('L');
    expect(res.body.items[0].toppings).toContain('Extra shot');
  });

  it('order history: GET /orders includes the new order', async () => {
    const orderId = (global as any).__e2eOrderId;
    const res = await request(app.getHttpServer())
      .get('/orders')
      .set(auth())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((o: { id: string }) => o.id === orderId);
    expect(found).toBeTruthy();
    expect(found.status).toBe('PAID');
  });
});