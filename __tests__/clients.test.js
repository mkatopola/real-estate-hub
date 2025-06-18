// __tests__/clients.test.js
jest.setTimeout(20000);

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Clients API', () => {
  const existingClientId = '68468685a121814ab05ae1a8';

  it('should GET all clients', async () => {
    const res = await request(app).get('/clients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should GET a client by ID', async () => {
    const res = await request(app).get(`/clients/${existingClientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', existingClientId);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
