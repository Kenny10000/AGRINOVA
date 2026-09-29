const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register endpoint (triggers OTP email)
router.post('/register', authController.registerAndSendOtp);

// Verify OTP endpoint (finalizes MongoDB record creation)
router.post('/verify-otp', authController.verifyOtpAndRegister);

module.exports = router;