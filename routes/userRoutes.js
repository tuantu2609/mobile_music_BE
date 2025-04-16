const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Private routes
router.get("/profile", validateToken, userController.getProfile);

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);


module.exports = router;
