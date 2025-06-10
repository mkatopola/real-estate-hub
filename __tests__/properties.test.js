// __tests__/properties.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Properties API', () => {
  let createdPropertyId;

  it('should GET all properties', async () => {
    const res = await request(app).get('/properties');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should POST a new property', async () => {
    const res = await request(app)
      .post('/properties')
      .send({
        title: `Test Property ${Date.now()}`,
        description: 'A test property',
        type: 'rent',
        address: '123 Test St',
        price: 1000,
        bedrooms: 2,
        bathrooms: 1,
        status: 'available'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    createdPropertyId = res.body.data._id;
  });

  it('should GET a property by ID', async () => {
    const res = await request(app).get(`/properties/${createdPropertyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', createdPropertyId);
  });

  it('should return 404 for GET property by invalid ID', async () => {
    const res = await request(app).get('/properties/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  it('should DELETE a property by ID', async () => {
    const res = await request(app).delete(`/properties/${createdPropertyId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for DELETE property by invalid ID', async () => {
    const res = await request(app).delete('/properties/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for POST with invalid data', async () => {
    const res = await request(app)
      .post('/properties')
      .send({ title: '', description: '', type: '', address: '', price: '', bedrooms: '', bathrooms: '', status: '' });
    expect(res.statusCode).toBe(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
