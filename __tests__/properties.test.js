// __tests__/properties.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Properties API', () => {
  const existingPropertyId = '6849ddf44b0e2d3769d9e21a';

  it('should GET all properties', async () => {
    const res = await request(app).get('/properties');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should GET a property by ID', async () => {
    const res = await request(app).get(`/properties/${existingPropertyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', existingPropertyId);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
