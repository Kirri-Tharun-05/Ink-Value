const express = require("express");
const passport = require('passport')
const { getUser,
    loginSuccess,
    loginFailed,
    logout,
    } = require("../controllers/authController.js");

const router = express.Router();

router.get('/user', getUser);
router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);

router.get('/token', (req, res) => {
    console.log(req.cookies); // Debugging
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token found" });
    }
    res.json({ token });
});
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
            sameSite: "None",
            path: "/" // Make it accessible everywhere
        });

        res.redirect("https://ink-value.onrender.com/home");
    }
);


module.exports = router;
