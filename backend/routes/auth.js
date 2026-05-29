import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendEmailVerification,
  resetPassword,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("phone")
    .optional({ checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid Indian phone number"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
];

const resetPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

// Auth routes
router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/refresh-token", refreshToken);

// Email verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protect, resendEmailVerification);

// Password reset
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  forgotPassword
);
router.put(
  "/reset-password/:resetToken",
  authLimiter,
  resetPasswordValidation,
  resetPassword
);
router.put(
  "/update-password",
  protect,
  updatePasswordValidation,
  updatePassword
);

// Profile update
router.put("/profile", protect, updateProfile);

export default router;
