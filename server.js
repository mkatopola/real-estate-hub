// server.js
require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const PORT = process.env.PORT || 3000;

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Middleware for session management

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
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
