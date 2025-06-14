// server.js
require("dotenv").config();
const express = require("express");
const session = require('express-session');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
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
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'lax',
  }
}));


app.use(passport.initialize());
app.use(passport.session());




// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/agents", require("./routes/agents"));
app.use("/clients", require("./routes/clients"));
app.use("/properties", require("./routes/properties"));

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
