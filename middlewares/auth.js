// Middleware/auth.js
exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Return JSON response instead of redirect for API requests
  if (req.accepts('json')) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Please authenticate first"
    });
  }
  
  // Redirect only for browser requests
  res.redirect("/auth/login");
};