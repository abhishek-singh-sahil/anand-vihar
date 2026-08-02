import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail, sendPasswordChangedEmail } from "../utils/email.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const sendTokenResponse = async (user, statusCode, res) => {
  // Check if user is blocked
  if (user.isBlocked) {
    if (user.blockedUntil && new Date() > new Date(user.blockedUntil)) {
      // Unblock
      await prisma.user.update({
        where: { id: user.id },
        data: { isBlocked: false, blockedUntil: null }
      });
    } else {
      const blockMsg = user.blockedUntil
        ? `Your account has been temporarily blocked until ${new Date(user.blockedUntil).toLocaleString()}.`
        : "Your account has been permanently blocked by the administrator.";
      return res.status(403).json({ success: false, message: blockMsg });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  // Limit capped to max 10 active tokens
  const tokenCount = await prisma.refreshToken.count({
    where: { userId: user.id }
  });
  if (tokenCount > 10) {
    const oldestToken = await prisma.refreshToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" }
    });
    if (oldestToken) {
      await prisma.refreshToken.delete({ where: { id: oldestToken.id } });
    }
  }

  // Cookie Options
  const cookieOptions = {
    httpOnly: true,
    secure: true, // always use secure cookies
    sameSite: "none", // Allow cross-origin requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 mins
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    user: {
      id: user.id,
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

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        phone: phone || "",
        isVerified: false
      }
    });

    await prisma.otpToken.create({
      data: {
        email,
        otp,
        expiresAt: otpExpires
      }
    });

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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User is already verified" });
    }

    // Verify OTP Token
    const otpRecord = await prisma.otpToken.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" }
    });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP code" });
    }

    // Delete OTP records for user
    await prisma.otpToken.deleteMany({ where: { email } });

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isVerified: true }
    });

    await sendWelcomeEmail(updatedUser.email, updatedUser.name);

    return sendTokenResponse(updatedUser, 200, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      // Send new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.otpToken.deleteMany({ where: { email } });
      await prisma.otpToken.create({
        data: {
          email,
          otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      });
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
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
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
    
    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken) {
      // Reuse detection: clear all user tokens if token is reused
      await prisma.refreshToken.deleteMany({ where: { userId: decoded.id } });
      return res.status(403).json({ success: false, message: "Refresh token reused or invalidated." });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(403).json({ success: false, message: "User not found" });
    }

    // Rotate token: remove old one
    await prisma.refreshToken.delete({ where: { id: dbToken.id } });
    
    // Generate new ones
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.otpToken.deleteMany({ where: { email } });
    await prisma.otpToken.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
      }
    });

    await sendForgotPasswordEmail(user.email, user.name, otp);

    res.status(200).json({ success: true, message: "Password reset OTP sent to email." });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpRecord = await prisma.otpToken.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" }
    });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP code" });
    }

    // Delete OTP
    await prisma.otpToken.deleteMany({ where: { email } });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: { password: passwordHash }
    });

    await prisma.refreshToken.deleteMany({ where: { userId: user.id } }); // Clear active sessions

    await sendPasswordChangedEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Password reset successfully. Please login." });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: passwordHash }
    });

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
    const updateData = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_profiles", "image");
      updateData.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const decodeGoogleCredential = (credential) => {
  try {
    const parts = credential.split(".");
    if (parts.length !== 3) return null;
    
    // Replace base64url characters to standard base64
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Pad base64 if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    
    const payload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch (err) {
    console.error("Error decoding Google credential:", err);
    return null;
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential, profile } = req.body;
    let email, name, picture;

    if (credential) {
      const payload = decodeGoogleCredential(credential);
      if (!payload || !payload.email) {
        return res.status(400).json({ success: false, message: "Invalid Google credential token" });
      }
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } else if (profile) {
      email = profile.email;
      name = profile.name;
      picture = profile.picture;
    } else {
      return res.status(400).json({ success: false, message: "Credential token or profile is required" });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      if (!user.isVerified) {
        user = await prisma.user.update({
          where: { email },
          data: { isVerified: true }
        });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          password: passwordHash,
          phone: "",
          profilePic: picture || "",
          isVerified: true
        }
      });
      await sendWelcomeEmail(user.email, user.name);
    }

    return sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
