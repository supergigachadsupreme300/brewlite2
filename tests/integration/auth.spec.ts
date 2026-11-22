import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app.module';

describe('Auth API (integration)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Auth User', email: 'auth1@example.com', password: 'secret123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('rejects duplicate registration', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Auth User', email: 'auth2@example.com', password: 'secret123' });
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Auth User', email: 'auth2@example.com', password: 'secret123' });
    expect(res.status).toBe(400);
  });

  it('logs in and accesses /auth/me', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Auth User', email: 'auth3@example.com', password: 'secret123' });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'auth3@example.com', password: 'secret123' })
      .expect(201);

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);
    expect(me.body.email).toBe('auth3@example.com');
  });

  it('rejects /auth/me without token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});