// __tests__/appointments.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Clients API', () => {
  const existingAppointmentId = '6851401c79b233c08fb3f91c';

  it('should GET all appointments', async () => {
    const res = await request(app).get('/appointments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should GET an appointment by ID', async () => {
    const res = await request(app).get(`/appointments/${existingAppointmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', existingAppointmentId);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

