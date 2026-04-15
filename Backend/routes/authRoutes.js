const express = require("express");
const router = express.Router();
const { register, login, getProfile, sendotp, verifyotp, resetPassword } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.post("/sendotp", sendotp);
router.post("/verifyotp", verifyotp);
router.post("/resetpwd", resetPassword);

module.exports = router;
