// // routes/auth.js
// const express = require("express");
// const router = express.Router();
// const passport = require("passport");

// // Authentication routes
// router.post(
//   // #swagger.tags = ['Authentication']
//   "/login", passport.authenticate("github"));

// router.get(
//   // #swagger.tags = ['Authentication']
//   "/github/callback",
//   passport.authenticate("github", {
//     failureRedirect: "/auth/login",
//     successRedirect: "/api-docs"
//   }),
//   (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect("/api-docs");
//   }
// );

// // Logout route
// router.get("/logout", async (req, res) => {
//   // #swagger.tags = ['Authentication']
//   try {
//     const session = req.sessionID;

//     // Destroy the session from the store
//     await new Promise((resolve, reject) => {
//       req.session.destroy((err) => {
//         if (err) reject(err);
//         else resolve();
//       });
//     });

//     // Clear cookies
//   res.clearCookie("connect.sid", {
//     path: "/",
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production"
//   });

//  res.status(200).json({
//     success: true,
//     message: "Logged out successfully"
//   });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Logout failed"
//     });
//   }
// });

// module.exports = router;

// routes/auth.js
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Start GitHub login 
<<<<<<< HEAD
router.get("/login", passport.authenticate("github"));
=======
router.get("/login", 
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Initiate GitHub authentication'
  passport.authenticate("github")
);
>>>>>>> db62196192e702fc71e0e750739885695de6ee6d

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
<<<<<<< HEAD

=======
>>>>>>> db62196192e702fc71e0e750739885695de6ee6d
   
module.exports = router;