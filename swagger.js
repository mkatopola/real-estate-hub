const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Real Estate Hub API',
    description: 'API documentation for Real Estate Hub application',
    version: '1.0.0',
  },
  host: process.env.BASE_URL || 'real-estate-hub-cmhc.onrender.com',
  schemes: ['https', 'http'],
  tags: [
    { name: 'Properties', description: 'Property management endpoints' },
    { name: 'Agents', description: 'Agent management endpoints' },
    { name: 'Clients', description: 'Client management endpoints' },
    { name: 'Users', description: 'User authentication endpoints' }
  ],
  definitions: {
    Property: {
      title: 'Sample Property',
      description: 'Property description',
      type: 'rent',
      address: '123 Main St',
      price: 1500,
      bedrooms: 3,
      bathrooms: 2,
      status: 'available'
    },
    Agent: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      licenseNumber: 'ABC123'
    },
    Client: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '123-456-7890'
    },
    User: {
      githubId: '12345',
      username: 'johndoe',
      email: 'john@example.com',
      profilePicture: 'https://example.com/pic.jpg'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
