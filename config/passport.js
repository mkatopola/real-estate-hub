const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const User = require('../models/user'); // Import the User model

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in the database
        let user = await User.findOne({ githubId: profile.id });
        
        if (!user) {
            // Create new user
            user = new User({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
                profilePicture: profile.photos?.[0]?.value || ''
            });

            // Save the new user
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;