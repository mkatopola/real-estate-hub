// routes/appointments.js
const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const Property = require("../models/property");
const Agent = require("../models/agent");
const Client = require("../models/client");
const { validateAppointment } = require("../middlewares/validate");
const { ensureAuth } = require("../middlewares/auth");

// CREATE a new appointment
router.post("/",
  // #swagger.tags = ['Appointments']
  // #swagger.description = 'Create a new appointment'
  // #swagger.security = [{ "OAuth2": [] }]
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Appointment information',
    required: true,
    schema: { $ref: '#/definitions/Appointment' }
  } */
  validateAppointment,
  ensureAuth,
  async (req, res, next) => {
    try {
      // Validate that referenced documents exist
      // Check if property exists
      const property = await Property.findById(req.body.property_id);
      if (!property) {
        return res.status(400).json({
          error: "Property not found with the provided ID"
        });
      }

      // Check if agent exists
      const agent = await Agent.findById(req.body.agent_id);
      if (!agent) {
        return res.status(400).json({
          error: "Agent not found with the provided ID"
        });
      }

      // Check if client exists
      const client = await Client.findById(req.body.client_id);
      if (!client) {
        return res.status(400).json({
          error: "Client not found with the provided ID"
        });
      }

      // Create the appointment
      const newAppointment = await Appointment.create(req.body);

      /* #swagger.responses[201] = {
        description: 'Appointment created successfully',
        schema: {
          success: true,
          message: 'Appointment created successfully',
          data: { $ref: '#/definitions/Appointment' }
        }
      } */
      res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: newAppointment
      });
    } catch (error) {
      console.error("Appointment creation error:", error);

      // Handle specific MongoDB validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({
          error: "Validation failed",
          details: validationErrors
        });
      }

      /* #swagger.responses[400] = {
        description: 'Bad Request',
        schema: { error: 'Error message' }
      } */
      res.status(400).json({ error: error.message });
      next();
    }
  }
);

// READ all appointments
router.get("/", 
  // #swagger.tags = ['Appointments']
  // #swagger.description = 'Get all appointments'
  // #swagger.security = [{ "OAuth2": [] }]
  ensureAuth,
  async (req, res, next) => {
    try {
      const appointments = await Appointment.find()
        .populate('property_id')
        .populate('agent_id')
        .populate('client_id');
      /* #swagger.responses[200] = {
        description: 'List of all appointments',
        schema: [{ $ref: '#/definitions/Appointment' }]
      } */
      res.status(200).json(appointments);
    } catch (error) {
      /* #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: { error: 'Error message' }
      } */
      res.status(500).json({ error: error.message });
      next();
    }
  }
);

// READ a single appointment by ID
router.get("/:id", 
  // #swagger.tags = ['Appointments']
  // #swagger.description = 'Get appointment by ID'
  // #swagger.parameters['id'] = { description: 'Appointment ID' }
  // #swagger.security = [{ "OAuth2": [] }]
  ensureAuth,
  async (req, res, next) => {
    try {
      const appointment = await Appointment.findById(req.params.id)
        .populate('property_id')
        .populate('agent_id')
        .populate('client_id');
      if (!appointment) {
        /* #swagger.responses[404] = {
          description: 'Appointment not found',
          schema: { message: 'Appointment not found' }
        } */
        return res.status(404).json({ message: "Appointment not found" });
      }
      /* #swagger.responses[200] = {
        description: 'Appointment found',
        schema: { $ref: '#/definitions/Appointment' }
      } */
      res.status(200).json(appointment);
    } catch (error) {
      /* #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: { error: 'Error message' }
      } */
      res.status(500).json({ error: error.message });
      next();
    }
  }
);

// UPDATE an appointment by ID
router.put("/:id", 
  // #swagger.tags = ['Appointments']
  // #swagger.description = 'Update an appointment by ID'
  // #swagger.security = [{ "OAuth2": [] }]
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Appointment information to update',
    required: true,
    schema: { $ref: '#/definitions/Appointment' }
  } */
  validateAppointment, 
  ensureAuth,
  async (req, res, next) => {
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedAppointment) {
        /* #swagger.responses[404] = {
          description: 'Appointment not found',
          schema: { success: false, message: 'Appointment not found' }
        } */
        return res.status(404).json({ 
          success: false,
          message: "Appointment not found" 
        });
      }

      /* #swagger.responses[200] = {
        description: 'Appointment updated successfully',
        schema: { 
          success: true, 
          message: 'Appointment updated successfully',
          data: { $ref: '#/definitions/Appointment' }
        }
      } */
      res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        data: updatedAppointment
      });
    } catch (error) {
      /* #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: { error: 'Error message' }
      } */
      res.status(500).json({ error: error.message });
      next();
    }
  }
);

// DELETE an appointment by ID
router.delete("/:id", 
  // #swagger.tags = ['Appointments']
  // #swagger.description = 'Delete appointment by ID'
  // #swagger.security = [{ "OAuth2": [] }]
  // #swagger.parameters['id'] = { description: 'Appointment ID' }
  ensureAuth,
  async (req, res, next) => {
    try {
      const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
      if (!deletedAppointment) {
        /* #swagger.responses[404] = {
          description: 'Appointment not found',
          schema: { success: false, message: 'Appointment not found' }
        } */
        return res.status(404).json({
          success: false,
          message: "Appointment not found"
        });
      }
      /* #swagger.responses[200] = {
        description: 'Appointment deleted successfully',
        schema: { success: true, message: 'Appointment deleted successfully' }
      } */
      res.status(200).json({
        success: true,
        message: "Appointment deleted successfully"
      });
    } catch (error) {
      /* #swagger.responses[500] = {
        description: 'Internal Server Error',
        schema: { error: 'Error message' }
      } */
      res.status(500).json({ error: error.message });
      next();
    }
  }
);

module.exports = router;
