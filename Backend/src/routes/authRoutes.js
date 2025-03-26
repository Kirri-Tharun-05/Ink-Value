const express = require("express");
const { signin, login, getUser,
    loginSuccess,
    loginFailed,
    logout,
    googleAuth,
    googleCallback } = require("../controllers/authController");

const router = express.Router();

router.get('/user', getUser);
router.get("/login/success", loginSuccess);
router.get("/login/failed", loginFailed);
router.get("/logout", logout);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.post("/signin", signin);
router.post("/login", login);


module.exports = router;
