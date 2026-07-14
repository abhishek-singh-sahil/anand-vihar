import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail, sendPasswordChangedEmail } from "../utils/email.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to user model (Refresh Token Rotation capability)
  user.refreshTokens.push(refreshToken);
  
  // Keep active tokens capped to max 10 devices
  if (user.refreshTokens.length > 10) {
    user.refreshTokens.shift();
  }
  await user.save();

  const isProduction = process.env.NODE_ENV === "production";
  
  // Cookie Options
  const cookieOptions = {
    httpOnly: true,
    secure: true, // Always true since browsers enforce it for localhost under chrome sometimes, or fallback to standard in non-ssl
    sameSite: "none", // Allow cross-origin requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 mins
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePic: user.profilePic,
      isVerified: user.isVerified,
    },
    accessToken,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name,
      email,
      password,
      phone,
      verificationOtp: otp,
      verificationOtpExpires: otpExpires,
    });

    await user.save();
    await sendVerificationEmail(email, name, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email using the OTP sent.",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }

    if (
      !user.verificationOtp ||
      user.verificationOtp !== otp ||
      new Date() > user.verificationOtpExpires
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP code" });
    }

    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      // Send new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationOtp = otp;
      user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendVerificationEmail(user.email, user.name, otp);

      return res.status(403).json({
        success: false,
        message: "Email is not verified. A new OTP has been sent to your email.",
        email: user.email,
        isNotVerified: true,
      });
    }

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
      // Remove refresh token from db
      await User.updateOne(
        { refreshTokens: refreshToken },
        { $pull: { refreshTokens: refreshToken } }
      );
    }

    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token missing" });
    }

    // Clear old cookie
    res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(token)) {
      // Reuse detection: If token is not in db but user exists, clear all tokens
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      return res.status(403).json({ success: false, message: "Refresh token reused or invalidated." });
    }

    // Rotate token: remove old one
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    
    // Generate new ones
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expired, please login again" });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendForgotPasswordEmail(user.email, user.name, otp);

    res.status(200).json({ success: true, message: "Password reset OTP sent to email." });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (
      !user.resetPasswordOtp ||
      user.resetPasswordOtp !== otp ||
      new Date() > user.resetPasswordOtpExpires
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP code" });
    }

    user.password = newPassword; // Hashed automatically in pre-save hook
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.refreshTokens = []; // Log out all active sessions for security
    await user.save();

    await sendPasswordChangedEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Password reset successfully. Please login." });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    await sendPasswordChangedEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_profiles", "image");
      user.profilePic = uploadResult.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
