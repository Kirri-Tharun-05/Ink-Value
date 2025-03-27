const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
// const User = require('../src/models/user');
const callbackURL ="http://localhost:8080/auth/google/callback";
//   process.env.NODE_ENV === "production"
//     ? "https://video-conference-application-backend.onrender.com/auth/google/callback"
//     : "http://localhost:8080/auth/google/callback";
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const username = profile.displayName;
                const email = profile.emails?.[0]?.value || "";
                const profilePicture = profile.photos?.[0]?.value || '';

                let user = await User.findOne({ googleId });
                if (!user) {
                    user = new User({
                        username,
                        email,
                        googleId,
                        profilePicture
                    });
                    await user.save();
                }
                return done(null, user._id);
            }
            catch (error) {
                return done(error, null);
            }
        }
    )
);
passport.serializeUser((userId, done) => {
    done(null, userId);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});