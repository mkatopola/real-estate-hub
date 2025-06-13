const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');



const users = new Map();


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    const user = users.get(id);
    done(null, user);    
});



passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists in the map
    let user = users.get(profile.id);
    if (!user) {
        user = {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl,
            emails: profile.emails
        };
        users.set(profile.id, user);
    }

    return done(null, user);
}

));


module.exports = passport;