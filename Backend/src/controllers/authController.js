const passport = require("passport");
const User = require("../models/user.js");
const httpStatus= require('http-status');
// const CLIENT_URL = "https://video-conference-application-frontend.onrender.com/home";
const CLIENT_URL = "https://ink-value.onrender.com/home";
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

        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
                return res.status(500).json({ message: "Logout failed" });
            }

            // Clear session and token cookies
            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "None",
            });

            console.log("✅ User logged out successfully");
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
};
