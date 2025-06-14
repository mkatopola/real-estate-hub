// swagger.js
const swaggerAutogen = require('swagger-autogen')();
const url = require('url');

// Parse BASE_URL to extract host without protocol
const baseUrl = process.env.BASE_URL 
  ? new URL(process.env.BASE_URL).hostname 
  : 'real-estate-hub-cmhc.onrender.com';

const doc = {
  info: {
    title: 'Real Estate Hub API',
    description: 'API documentation for Real Estate Hub application',
    version: '1.0.0',
  },
  host: baseUrl,
  basePath: '/',
  schemes: ['https'],
  tags: [
    { name: 'Properties', description: 'Property management endpoints' },
    { name: 'Agents', description: 'Agent management endpoints' },
    { name: 'Clients', description: 'Client management endpoints' },
    { name: 'Authentication', description: 'Authentication endpoints' }
  ],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      flow: 'accessCode',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      scopes: {
        'read:user': 'Read user profile'
      }
    }
  },
  definitions: {
    Property: {
      type: 'object',
      required: ["title", "description", "type", "address", "price", "bedrooms", "bathrooms", "status"],
      properties: {
        title: { 
          type: 'string',
          example: 'Modern Downtown Apartment' 
        },
        description: { 
          type: 'string',
          example: 'Luxury apartment with city views' 
        },
        type: { 
          type: 'string',
          enum: ['rent', 'sale'],
          example: 'rent' 
        },
        address: { 
          type: 'string',
          example: '123 Main St, City, State' 
        },
        price: { 
          type: 'number',
          example: 2500 
        },
        bedrooms: { 
          type: 'number',
          example: 2 
        },
        bathrooms: { 
          type: 'number',
          example: 2 
        },
        status: { 
          type: 'string',
          enum: ['available', 'sold', 'rented'],
          example: 'available' 
        }
      }
    },
    Agent: {
      type: 'object',
      required: ["name", "email", "phone", "licenseNumber"],
      properties: {
        name: { 
          type: 'string',
          example: 'Aisha Brown' 
        },
        email: { 
          type: 'string',
          format: 'email',
          example: 'abrown@engineering.ae' 
        },
        phone: { 
          type: 'string',
          example: '555-876-5432' 
        },
        licenseNumber: { 
          type: 'string',
          example: 'ENG11223344556' 
        }
      }
    },
    Client: {
      type: 'object',
      required: ["name", "email", "phone"],
      properties: {
        name: { 
          type: 'string',
          example: 'Jane Doe' 
        },
        email: { 
          type: 'string',
          format: 'email',
          example: 'jane@example.com' 
        },
        phone: { 
          type: 'string',
          example: '555-987-6543' 
        }
      }
    },
    User: {
      type: 'object',
      required: ["githubId", "username", "email", "profilePicture"],
      properties: {
        githubId: { 
          type: 'string',
          example: '12345' 
        },
        username: { 
          type: 'string',
          example: 'johndoe' 
        },
        email: { 
          type: 'string',
          format: 'email',
          example: 'john@example.com' 
        },
        profilePicture: { 
          type: 'string',
          example: 'https://example.com/pic.jpg' 
        }
      }
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