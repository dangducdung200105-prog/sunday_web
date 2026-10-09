const express = require("express");

const {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");
const verifyTurnstile = require("../middlewares/verifyTurnstile");
const router = express.Router();

router.post("/register", verifyTurnstile("register"), register);

router.post("/login", verifyTurnstile("login"), login);

router.post(
  "/forgot-password",
  verifyTurnstile("forgot-password"),
  forgotPassword,
);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

router.post("/reset-password", resetPassword);

router.get("/me", authMiddleware, getMe);

module.exports = router;
