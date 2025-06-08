// routes/properties.js
const express = require("express");
const router = express.Router();
const Property = require("../models/property");
const { validateProperty } = require("../middlewares/validate");
// const { ensureAuth } = require("../middlewares/auth");

// CREATE a new property with duplicate check
router.post("/", validateProperty, async (req, res, next) => {
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
router.get("/", async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// READ a single property by ID
router.get("/:id", async (req, res, next) => {
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

module.exports = router;
