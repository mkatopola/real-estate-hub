// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: messages
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate ${field} entered`,
      field: field
    });
  }

  res.status(500).json({
    success: false,
    message: "Server Error"
  });
};
