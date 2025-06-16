// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { ensureAuth } = require("../middlewares/auth");

// Middleware to check if authenticated user owns the account
const checkOwnership = (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: "You can only modify your own account"
    });
  }
  next();
};

// READ all users
router.get(
  "/",
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "OAuth2": [] }]
  // #swagger.description = 'Get all users (authenticated users only)'
  ensureAuth,
  async (req, res) => {
    try {
      const users = await User.find().select("-__v");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// READ a single user by ID
router.get(
  "/:id",
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "OAuth2": [] }]
  // #swagger.description = 'Get user by ID (authenticated users only)'
  // #swagger.parameters['id'] = { description: 'User ID' }
  ensureAuth,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-__v");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// UPDATE user by ID (only owner can update)
router.put(
  "/:id",
  // #swagger.tags = ['Users'] 
  // #swagger.security = [{ "OAuth2": [] }]
  // #swagger.description = 'Update user by ID (only owner can update)'
  // #swagger.parameters['id'] = { description: 'User ID' }
  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'User information to update',
    required: true,
    schema: { $ref: '#/definitions/User' }
  } */
  ensureAuth,
  checkOwnership,
  [
    body("username")
      .optional()
      .isString()
      .withMessage("Username must be a string")
      .notEmpty()
      .withMessage("Username cannot be empty"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("profilePicture")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select("-__v");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(409).json({
          success: false,
          message: `${field} already exists`,
          field: field
        });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE user by ID (only owner can delete)
router.delete(
  "/:id",
  // #swagger.tags = ['Users']
  // #swagger.security = [{ "OAuth2": [] }]
  // #swagger.description = 'Delete user by ID (only owner can delete)'
  // #swagger.parameters['id'] = { description: 'User ID' }
  ensureAuth,
  checkOwnership,
  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Logout after account deletion (Passport v0.6+)
      req.logout();
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({
          success: true,
          message: "User account deleted successfully"
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
