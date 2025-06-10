// __tests__/clients.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Clients API', () => {
  let createdClientId;

  it('should GET all clients', async () => {
    const res = await request(app).get('/clients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should POST a new client', async () => {
    const res = await request(app)
      .post('/clients')
      .send({
        name: 'Test Client',
        email: `testclient${Date.now()}@example.com`,
        phone: '+15555555555'
      });
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    createdClientId = res.body.data._id;
  });

  it('should GET a client by ID', async () => {
    const res = await request(app).get(`/clients/${createdClientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdClientId);
  });

  it('should return 404 for GET client by invalid ID', async () => {
    const res = await request(app).get('/clients/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  it('should DELETE a client by ID', async () => {
    const res = await request(app).delete(`/clients/${createdClientId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for DELETE client by invalid ID', async () => {
    const res = await request(app).delete('/clients/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for POST with invalid data', async () => {
    const res = await request(app)
      .post('/clients')
      .send({ name: '', email: 'notanemail', phone: '' });
    expect(res.statusCode).toBe(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
