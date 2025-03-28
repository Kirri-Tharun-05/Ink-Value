// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require("mongoose");
// const User = require('../models/user');

// const callbackURL = "http://localhost:8080/auth/google/callback";

// // passport.use(
// //     new GoogleStrategy(
// //         {
// //             clientID: process.env.GOOGLE_CLIENT_ID,
// //             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //             callbackURL: callbackURL,
// //         },
// //         async (accessToken, refreshToken, profile, done) => {
// //             try {
// //                 const googleId = profile.id;
// //                 const username = profile.displayName;
// //                 const email = profile.emails?.[0]?.value || "";
// //                 const profilePicture = profile.photos?.[0]?.value || '';

// //                 let user = await User.findOne({ googleId });
// //                 if (!user) {
// //                     user = new User({
// //                         username,
// //                         email,
// //                         googleId,
// //                         profilePicture,
// //                         accessToken:accessToken,
// //                     });
// //                     await user.save();
// //                 } else {
// //                     user.accessToken = accessToken;
// //                     await user.save();
// //                 }
// //                 return done(null, user);  // ✅ Pass the entire user object
// //             }
// //             catch (error) {
// //                 return done(error, null);
// //             }
// //         }
// //     )
// // );

// // passport.serializeUser((user, done) => {
// //     done(null, user._id);
// // });

// // passport.deserializeUser(async (id, done) => {
// //     try {
// //         const user = await User.findById(new mongoose.Types.ObjectId(id));
// //         done(null, user);
// //     } catch (err) {
// //         done(err, null);
// //     }
// // });

// // module.exports = passport;
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: callbackURL,
//             scope: [
//                 "profile",
//                 "email",
//                 "https://www.googleapis.com/auth/drive.file"  // ✅ Add Google Drive Scope
//             ],
//             passReqToCallback: true
//         },
//         async (request, accessToken, refreshToken, profile, done) => {
//             try {
//                 const googleId = profile.id;
//                 const username = profile.displayName;
//                 const email = profile.emails?.[0]?.value || "";
//                 const profilePicture = profile.photos?.[0]?.value || '';

//                 let user = await User.findOne({ googleId });

//                 if (!user) {
//                     user = new User({
//                         username,
//                         email,
//                         googleId,
//                         profilePicture,
//                         accessToken,  // ✅ Save access token
//                         refreshToken  // ✅ Save refresh token (if needed)
//                     });
//                     await user.save();
//                 } else {
//                     user.accessToken = accessToken;
//                     user.refreshToken = refreshToken;
//                     await user.save();
//                 }

//                 // ✅ Store access token in session
//                 request.session.accessToken = accessToken;

//                 return done(null, user);
//             }
//             catch (error) {
//                 return done(error, null);
//             }
//         }
//     )
// );


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
const User = require('../models/user');

const callbackURL = "http://localhost:8080/auth/google/callback";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: callbackURL,
            scope: [
                "profile",
                "email",
                "https://www.googleapis.com/auth/drive.file"  // ✅ Google Drive Scope
            ],
            passReqToCallback: true
        },
        async (request, accessToken, refreshToken, profile, done) => {
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
                        profilePicture,
                        accessToken,  // ✅ Save access token
                    });
                    await user.save();
                } else {
                    // ✅ Always update accessToken and refreshToken
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken || user.refreshToken;
                    await user.save();
                }

                // ✅ Store access token in session for future requests
                request.session.accessToken = accessToken;

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// ✅ Serialize user ID
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// ✅ Deserialize user and include `accessToken`
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id));

        if (user) {
            done(null, { 
                _id: user._id,
                username: user.username,
                googleId: user.googleId,
                email: user.email,
                profilePicture: user.profilePicture,
                accessToken: user.accessToken  // ✅ Ensure accessToken is available in `req.user`
            });
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
