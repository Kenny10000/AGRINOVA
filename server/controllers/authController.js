const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const otpStorage = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.registerAndSendOtp = async (req, res) => {
  try {
    const { fullName, username, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 10);

    otpStorage.set(email, {
      otp,
      expiresAt,
      userData: { fullName, username, email, password: hashedPassword, phone, role }
    });

    const mailOptions = {
      from: '"Agrinova Security" <no-reply@agrinova.com>',
      to: email,
      subject: 'Verify Your Agrinova Account - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; margin: auto; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #059669; margin-top: 0;">Welcome to Agrinova, ${fullName} 🌱</h2>
          <p style="font-size: 15px; color: #4b5563;">Please use the verification code below to complete your setup. This code is valid for 10 minutes.</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; font-size: 28px; font-weight: bold; text-align: center; color: #065f46; letter-spacing: 6px; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #6b7280;">If you didn't request this registration, please safely ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent to your email successfully.' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ error: 'Failed to send verification email. Please check your configuration.' });
  }
};

exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStorage.get(email);
    if (!record) {
      return res.status(400).json({ error: 'No active registration found or OTP has expired.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ error: 'OTP code has expired. Please register again.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check and try again.' });
    }

    const newUser = new User(record.userData);
    await newUser.save();
    otpStorage.delete(email);

    res.status(201).json({ 
      success: true, 
      message: 'Email verified and account registered successfully!',
      user: {
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Server error during verification.' });
  }
};