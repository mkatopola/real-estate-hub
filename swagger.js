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
    { name: 'Users', description: 'User authentication endpoints' },
    { name: 'Authentication', description: 'Authentication endpoints' }
  ],
  definitions: {
    Property: {
      title: 'Modern Downtown Apartment',
      description: 'Luxury apartment with city views',
      type: 'rent',
      address: '123 Main St, City, State',
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      status: 'available',
      features: ['parking', 'gym', 'pool'],
      images: ['image1.jpg', 'image2.jpg'],
      createdAt: '2025-06-09T07:00:21.543Z'
    },
    Agent: {
      name: 'Aisha Brown',
      email: 'abrown@engineering.ae',
      phone: '555-876-5432',
      licenseNumber: 'ENG11223344556',
      __v: 0
    },
    Client: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-987-6543'
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
const endpointsFiles = [
  './routes/auth.js',
  './routes/agents.js',
  './routes/clients.js',
  './routes/properties.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
