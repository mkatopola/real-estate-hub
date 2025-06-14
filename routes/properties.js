// routes/properties.js
const express = require("express");
const router = express.Router();
const Property = require("../models/property");
const { validateProperty } = require("../middlewares/validate");
const { ensureAuth } = require("../middlewares/auth");

// CREATE a new property with duplicate check
router.post("/", 
  // #swagger.tags = ['Properties']
  // #swagger.description = 'Create a new property'
  // #swagger.security = [{ "OAuth2": [] }]
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Property information',
    required: true,
    schema: { $ref: '#/definitions/Property' }
  } */
  validateProperty, 
  ensureAuth,
  async (req, res, next) => {
  try {
    const { title } = req.body;

    // Check for duplicate property by title
    const existingProperty = await Property.findOne({ title });
    if (existingProperty) {
      return res.status(400).json({
        success: false,
        message: "Property with this title already exists",
        conflictField: "title"
      });
    }

    const newProperty = await Property.create(req.body);
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: newProperty
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

// READ all properties
router.get("/", 
  // #swagger.tags = ['Properties']
  // #swagger.description = 'Get all properties'
  async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// READ a single property by ID
router.get("/:id", 
  // #swagger.tags = ['Properties']
  // #swagger.description = 'Get property by ID'
  // #swagger.parameters['id'] = { description: 'Property ID' }
  async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// UPDATE a property by ID
router.put("/:id", 
  // #swagger.tags = ['Properties']
  // #swagger.description = 'Update a property by ID'
  // #swagger.security = [{ "OAuth2": [] }]
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Property information to update',
    required: true,
    schema: { $ref: '#/definitions/Property' }
  } */
  validateProperty, 
  ensureAuth,
  async (req, res, next) => {
  try {
    // Check if property with new title already exists
    if (req.body.title) {
      const existingProperty = await Property.findOne({ 
        title: req.body.title,
        _id: { $ne: req.params.id } 
      });
      
      if (existingProperty) {
        return res.status(400).json({
          success: false,
          message: "Property with this title already exists",
          conflictField: "title"
        });
      }
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ 
        success: false,
        message: "Property not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// DELETE a property by ID
router.delete("/:id", 
  // #swagger.tags = ['Properties']
  // #swagger.description = 'Delete property by ID'
  // #swagger.security = [{ "OAuth2": [] }]
  // #swagger.parameters['id'] = { description: 'Property ID' }
  ensureAuth,
  async (req, res, next) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

module.exports = router;