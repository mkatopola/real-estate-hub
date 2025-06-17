// server.js
require("dotenv").config();
const express = require("express");
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Force reload swagger file to avoid caching issues
delete require.cache[require.resolve('./swagger-output.json')];
const swaggerFile = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger-output.json'), 'utf8'));
const passport = require('./config/passport');
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;


// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();


app.use(express.json());


app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'Keyboard Cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Mock authentication middleware only during tests
if (process.env.NODE_ENV === 'test') {
  app.use(require('./middlewares/mockAuth'));
}

app.use(passport.initialize());
app.use(passport.session());




// Serve swagger JSON directly
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerFile);
});

// Swagger documentation
const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    url: '/api-docs.json'
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Real Estate Hub API Documentation"
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/agents", require("./routes/agents"));
app.use("/clients", require("./routes/clients"));
app.use("/properties", require("./routes/properties"));
app.use("/users", require("./routes/users"));
app.use("/appointments", require("./routes/appointments"));
// Health check route
app.get("/", (req, res) => res.send("Welcome to the REAL ESTATE HUB API"));

// Error handling middleware
app.use(require("./middlewares/errorHandler"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
