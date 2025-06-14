// routes/auth.js
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Start GitHub login 
router.get("/login", 
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Initiate GitHub authentication'
  passport.authenticate("github")
);

// Callback route for GitHub to redirect to after authentication
router.get(
  "/github/callback",
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'GitHub authentication callback'
  passport.authenticate("github", {
    failureRedirect: "/auth/login",
    successRedirect: "/api-docs"
  }) 
);

// Logout route
router.get("/logout", 
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Log out current user'
  async (req, res) => {
  try {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({
          success: true,
          message: "Logged out successfully"
        });
      });
    });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }
  });
   
module.exports = router;