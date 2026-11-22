import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';
import {
  OrderStatus,
  PaymentMethod,
  PickupType,
} from '../../apps/api/src/orders/order.entity';

jest.setTimeout(60000);

describe('Orders API (integration)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Order Tester', email: 'order-tester@example.com', password: 'secret123' });
    token = reg.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  function auth() {
    return { Authorization: `Bearer ${token}` };
  }

  it('POST /orders creates a new order successfully (HTTP 201)', async () => {
    const payload = {
      customerName: 'Integration Test User',
      customerPhone: '0901234567',
      pickupType: PickupType.TAKEAWAY,
      paymentMethod: PaymentMethod.MOMO,
      items: [{ productId: '1', quantity: 1, size: 'M' }],
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set(auth())
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe(OrderStatus.PENDING);
    expect(response.body.customerName).toBe('Integration Test User');
    expect(response.body.items.length).toBe(1);
    expect(response.body.total).toBeGreaterThan(0);
  });

  it('POST /orders returns 400 when stock is insufficient', async () => {
    const payload = {
      customerName: 'Out of stock tester',
      customerPhone: '0901234567',
      pickupType: PickupType.TAKEAWAY,
      paymentMethod: PaymentMethod.MOMO,
      items: [{ productId: '5', quantity: 1 }], // Mocha stock is 0
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set(auth())
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/không đủ số lượng/);
  });

  it('GET /orders returns a list of orders', async () => {
    const response = await request(app.getHttpServer()).get('/orders').set(auth());
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /orders/:id returns existing order and PATCH /orders/:id/status updates status', async () => {
    // 1. Create order
    const createRes = await request(app.getHttpServer())
      .post('/orders')
      .set(auth())
      .send({
        customerName: 'Lifecycle Test',
        customerPhone: '0988776655',
        pickupType: PickupType.DINE_IN,
        tableNumber: 'Table 3',
        paymentMethod: PaymentMethod.CARD,
        items: [{ productId: '2', quantity: 1 }],
      });

    const orderId = createRes.body.id;

    // 2. Fetch order
    const getRes = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set(auth());
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(orderId);
    expect(getRes.body.tableNumber).toBe('Table 3');

    // 3. Update status PENDING -> PAID
    const patchRes = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set(auth())
      .send({ status: OrderStatus.PAID });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.status).toBe(OrderStatus.PAID);
  });
});
