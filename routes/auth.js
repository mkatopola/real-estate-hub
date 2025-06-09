// routes/auth.js
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Authentication routes
router.post(
  // #swagger.tags = ['Authentication']
  "/login", passport.authenticate("github"));

router.get(
  // #swagger.tags = ['Authentication']
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/api-docs"
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/api-docs");
  }
);

// Logout route
router.get("/logout", async (req, res) => {
  // #swagger.tags = ['Authentication']
  try {
    const session = req.sessionID;

    // Destroy the session from the store
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Clear cookies
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });

 res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
});

module.exports = router;