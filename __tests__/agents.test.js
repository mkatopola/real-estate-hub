// __tests__/agents.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Agents API', () => {
  let createdAgentId;

  it('should GET all agents', async () => {
    const res = await request(app).get('/agents');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should POST a new agent', async () => {
    const res = await request(app)
      .post('/agents')
      .send({
        name: 'Test Agent',
        email: `testagent${Date.now()}@example.com`,
        phone: '+15555555555',
        licenseNumber: `LIC${Date.now()}`
      });
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    createdAgentId = res.body.data._id;
  });

  it('should GET an agent by ID', async () => {
    const res = await request(app).get(`/agents/${createdAgentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdAgentId);
  });

  it('should return 404 for GET agent by invalid ID', async () => {
    const res = await request(app).get('/agents/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

it('should return 400 for POST with invalid data', async () => {
    const res = await request(app)
      .post('/agents')
      .send({ name: '', email: 'notanemail', phone: '', licenseNumber: '' });
    expect(res.statusCode).toBe(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
