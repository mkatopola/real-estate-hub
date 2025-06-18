// __tests__/agents.test.js
jest.setTimeout(20000);

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Agents API', () => {
  const existingAgentId = '6849e18a4b0e2d3769d9e224';

  it('should GET all agents', async () => {
    const res = await request(app).get('/agents');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should GET an agent by ID', async () => {
    const res = await request(app).get(`/agents/${existingAgentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', existingAgentId);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
