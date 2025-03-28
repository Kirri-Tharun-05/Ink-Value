const express = require("express");
const passport = require('passport')
const { signin, login, getUser,
    loginSuccess,
    loginFailed,
    logout,
    googleAuth,
    googleCallback } = require("../controllers/authController.js");

const router = express.Router();

router.get('/user', getUser);
router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);
// router.get("/google", googleAuth);
// router.get("/google/callback", googleCallback);
router.post("/signin", signin);
router.post("/login", login);

router.get('/google', passport.authenticate('google', {
    scope: [
        "profile", "email", "https://www.googleapis.com/auth/drive.file"
    ],
      prompt: "select_account"
}));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        if (!req.user || !req.user.accessToken) {
            return res.status(401).json({ message: "Authentication failed!" });
        }

        const token = req.user.accessToken;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set true in production
            sameSite: "Strict",
            path: "/" // Make it accessible everywhere
        });

        res.redirect("http://localhost:5173/home");
    }
);


module.exports = router;
