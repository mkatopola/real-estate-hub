// routes/agents.js
const express = require("express");
const router = express.Router();
const Agent = require("../models/agent");
const { validateAgent } = require("../middlewares/validate");
// const { ensureAuth } = require("../middlewares/auth");

// CREATE a new agent with duplicate check
router.post("/", validateAgent, async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check for duplicate agent by email
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent with this email already exists",
        conflictField: "email"
      });
    }

    const newAgent = await Agent.create(req.body);
    res.status(201).json({
      success: true,
      message: "Agent created successfully",
      data: newAgent
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

// READ all agents
router.get("/", async (req, res, next) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// READ a single agent by ID
router.get("/:id", async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// UPDATE an agent by ID
router.put("/:id", validateAgent, async (req, res, next) => {
  try {
    // Check if agent with new email already exists (if email is being updated)
    if (req.body.email) {
      const existingAgent = await Agent.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id } 
      });
      
      if (existingAgent) {
        return res.status(400).json({
          success: false,
          message: "Agent with this email already exists",
          conflictField: "email"
        });
      }
    }

    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ 
        success: false,
        message: "Agent not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      data: updatedAgent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

// DELETE an agent by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
    
    if (!deletedAgent) {
      return res.status(404).json({ 
        success: false,
        message: "Agent not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Agent deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

module.exports = router;
