// swagger.js
const swaggerAutogen = require("swagger-autogen")();
const url = require("url");

// Parse BASE_URL to extract host without protocol
const baseUrl = process.env.BASE_URL
  ? new URL(process.env.BASE_URL).hostname
  : "real-estate-hub-cmhc.onrender.com";

const doc = {
  info: {
    title: "Real Estate Hub API",
    description: "API documentation for Real Estate Hub application",
    version: "1.0.0"
  },
  host: baseUrl,
  basePath: "/",
  schemes: ["https"],
  tags: [
    { name: "Authentication", description: "Authentication endpoints" },
    { name: "Properties", description: "Property management endpoints" },
    { name: "Agents", description: "Agent management endpoints" },
    { name: "Clients", description: "Client management endpoints" },
    { name: "Users", description: "User management endpoints" },
    { name: "Appointments", description: "Appointment management endpoints" }
  ],
  securityDefinitions: {
    OAuth2: {
      type: "oauth2",
      flow: "accessCode",
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      scopes: {
        "read:user": "Read user profile",
        "write:user": "Write user profile"
      }
    }
  },
  definitions: {
    Property: {
      title: "Modern Downtown Apartment",
      description: "Luxury apartment with city views",
      type: "rent",
      address: "123 Main St, City, State",
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      status: "available"
    },
    Agent: {
      name: "Aisha Brown",
      email: "abrown@engineering.ae",
      phone: "555-876-5432",
      licenseNumber: "ENG11223344556"
    },
    Client: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555-987-6543"
    },
    User: {
      githubId: "12345",
      username: "johndoe",
      email: "john@example.com",
      profilePicture: "https://example.com/pic.jpg"
    },
    Appointment: {
      property_id: "60d21b4667d0d8992e610c85",
      agent_id: "60d21b4667d0d8992e610c86",
      client_id: "60d21b4667d0d8992e610c87",
      appointment_date: "2025-06-25",
      start_time: "14:00",
      end_time: "15:00",
      status: "scheduled",
      notes: "Client is interested in purchasing the property"
    }
  }
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
