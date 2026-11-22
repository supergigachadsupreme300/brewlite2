import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';

describe('Product Detail API (integration)', () => {
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

  it('GET /products/:id returns product detail for existing id', async () => {
    const response = await request(app.getHttpServer()).get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', '1');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('stock');
    expect(response.body).toHaveProperty('isAvailable');
  });

  it('GET /products/:id returns 404 for missing id', async () => {
    const response = await request(app.getHttpServer()).get('/products/does-not-exist');
    expect(response.status).toBe(404);
  });

  it('GET /products/:id returns 400 for empty id', async () => {
    const response = await request(app.getHttpServer()).get('/products/%20');
    expect(response.status).toBe(400);
  });

  it('GET /products/:id returns product with stock status fields', async () => {
    const response = await request(app.getHttpServer()).get('/products/prod-001');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'prod-001');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
    expect(response.body).toHaveProperty('stock');
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('isAvailable');
    expect(typeof response.body.stock).toBe('number');
    expect(response.body.stock).toBeGreaterThanOrEqual(0);
  });

  it('GET /health returns ok', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'brewlite-api' });
  });
});