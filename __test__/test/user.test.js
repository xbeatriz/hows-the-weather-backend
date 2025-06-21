import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import jwt from '../../utils/jwt.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('User API', () => {
  describe('a registar', () => {
    it('deve registar um novo utilizador', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass1234!',
      };

      const res = await request(app).post('/api/user/register').send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Conta criada. Por favor, verifica o seu email.");
    });

    it('não deve permitir email duplicados', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'pass1234',
      });

      const res = await request(app).post('/api/user/register').send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'pass1234',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email already in use");
    });
  });

  describe('a fazer login', () => {
    it('should login a verified user with correct credentials', async () => {
      const user = await User.create({
        name: 'Test',
        email: 'verified@example.com',
        password: 'Test1234!',
        isVerified: true,
      });

      const res = await request(app).post('/api/user/login').send({
        email: 'verified@example.com',
        password: 'Test1234!',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.data.user.email).toBe(user.email);
    });

    it('should not login with wrong password', async () => {
      await User.create({
        name: 'Test',
        email: 'wrongpass@example.com',
        password: 'Test1234!',
        isVerified: true,
      });

      const res = await request(app).post('/api/user/login').send({
        email: 'wrongpass@example.com',
        password: 'WrongPass123',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Email ou senha incorretos');
    });

    it('should not login if user is not verified', async () => {
      await User.create({
        name: 'Test',
        email: 'unverified@example.com',
        password: 'Test1234!',
        isVerified: false,
      });

      const res = await request(app).post('/api/user/login').send({
        email: 'unverified@example.com',
        password: 'Test1234!',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Por favor, verifique seu email antes de entrar');
    });
  });
0
  describe('a verificar email', () => {
    it('should verify email with a valid token', async () => {
      const user = await User.create({
        name: 'VerifyMe',
        email: 'verifyme@example.com',
        password: 'Test1234!',
      });

      const token = jwt.generateEmailVerificationToken(user._id);

      const res = await request(app).get(`/api/user/verify-email/${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Email verificado com sucesso.");
    });

    it('should fail with invalid token', async () => {
      const res = await request(app).get('/api/user/verify-email/invalidtoken');

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Link de verificação inválido ou expirado");
    });
  });

  describe('rotas protegidas', () => {
    let token;
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Protected',
        email: 'protected@example.com',
        password: 'Test1234!',
        isVerified: true,
      });
      token = jwt.generateAuthToken(user._id);
    });

    it('should get current user data (GET /me)', async () => {
      const res = await request(app)
        .get('/api/user/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(user.email);
    });

    it('should update current user data (PATCH /me)', async () => {
      const res = await request(app)
        .patch('/api/user/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.name).toBe('Updated Name');
    });

    it('should delete current user (DELETE /me)', async () => {
      const res = await request(app)
        .delete('/api/user/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Conta eliminada com sucesso');
    });
  });
  
});
