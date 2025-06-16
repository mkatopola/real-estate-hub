// __tests__/users.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Users API', () => {
    const existingUserId = '684e183d60efd51ae34f9310'

  it('should GET all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should GET a user by ID', async () => {
    const res = await request(app).get(`/users/${existingUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', existingUserId);
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});
