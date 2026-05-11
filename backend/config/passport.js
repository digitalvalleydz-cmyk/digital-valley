const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            username: profile.emails[0].value.split('@')[0] + Math.floor(Math.random() * 1000), // Generate a random username
            password: 'google_oauth_placeholder_password' // Placeholder password
        };

        try {
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // If user exists but doesn't have googleId, update it
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
