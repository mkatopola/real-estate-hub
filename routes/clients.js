// routes/clients.js
const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const { validateClient } = require('../middlewares/validate');
// const { ensureAuth } = require('../middlewares/auth');

// CREATE a new client with duplicate check
router.post('/', validateClient, async (req, res, next) => {
  // #swagger.tags = ['Clients']
  try {
    const { email } = req.body;

    // Check for duplicate client by email
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
        conflictField: "email"
      });
    }

    const newClient = await Client.create(req.body);
    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: newClient
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

// READ all clients
router.get('/', async (req, res, next) => {
  // #swagger.tags = ['Clients']
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// READ a single client by ID
router.get('/:id', async (req, res, next) => {
  // #swagger.tags = ['Clients']
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// UPDATE a client by ID
router.put('/:id', validateClient, async (req, res, next) => {
  // #swagger.tags = ['Clients']
  try {
    // Check if client with new email already exists (if email is being updated)
    if (req.body.email) {
      const existingClient = await Client.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id } 
      });
      
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Client with this email already exists",
          conflictField: "email"
        });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ 
        success: false,
        message: "Client not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// DELETE a client by ID


module.exports = router;