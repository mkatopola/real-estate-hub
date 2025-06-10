// middleware/validate.js
const { body, validationResult } = require("express-validator");

exports.validateAgent = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone('any')
    .withMessage("Phone must be a valid mobile phone number"),
  body("licenseNumber")
    .notEmpty()
    .withMessage("License number is required")
    .isString()
    .withMessage("License number must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateClient = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone('any')
    .withMessage("Phone must be a valid mobile phone number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
exports.validateProperty = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["rent", "sale"])
    .withMessage("Type must be either 'rent' or 'sale'"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("bedrooms")
    .notEmpty()
    .withMessage("Bedrooms is required")
    .isNumeric()
    .withMessage("Bedrooms must be a number"),
  body("bathrooms")
    .notEmpty()
    .withMessage("Bathrooms is required")
    .isNumeric()
    .withMessage("Bathrooms must be a number"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
