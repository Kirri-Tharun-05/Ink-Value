const passport = require("passport");
const User = require("../models/user.js");
const httpStatus= require('http-status');
// const CLIENT_URL = "https://video-conference-application-frontend.onrender.com/home";
const CLIENT_URL = "http://localhost:5173/home";

exports.signin = async (req, res) => {
  try {
    console.log("Requested for sign in:", req.body);
    const { username, password } = req.body;
    const newUser = new User({ username });
    const result = await User.register(newUser, password);
    console.log("✅ Registered:", result);
    res.status(httpStatus.status.OK).json({ message: "Registered Successfully" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(httpStatus.status.FORBIDDEN).json({ message: error.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(httpStatus.status.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(httpStatus.status.OK).json({ message: "Successfully Logged In", user });
    });
  })(req, res, next);
};


exports.getUser = (req, res) => {
    console.log('inside Get Users route', req.user);
    console.log('inside Get Users route', req.session);
    if (req.user) {
        console.log("✅ Authenticated User:", req.user);
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: "Not authenticated inside getUser Route" });
    }
};

exports.loginSuccess = (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: req.user,
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Not authenticated",
        });
    }
};

exports.loginFailed = (req, res) => {
    res.status(401).json({
        success: false,
        message: "Login failed",
    });
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return next(err);
        }
        req.session.destroy(() => {
            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            });
            console.log("✅ User logged out successfully");
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
};

// exports.googleAuth = passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
// });

// exports.googleCallback = passport.authenticate("google", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/auth/login/failed",
// });