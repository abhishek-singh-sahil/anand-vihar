import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    let token = "";

    // 1. Check cookies for token
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } 
    // 2. Check auth header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication token missing.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user and exclude password
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session expired. User no longer exists.",
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      // Check if block duration is expired
      if (user.blockedUntil && new Date() > new Date(user.blockedUntil)) {
        // Automatically unblock user
        await prisma.user.update({
          where: { id: user.id },
          data: { isBlocked: false, blockedUntil: null }
        });
      } else {
        const blockMsg = user.blockedUntil
          ? `Your account has been temporarily blocked until ${new Date(user.blockedUntil).toLocaleString()}.`
          : "Your account has been permanently blocked by the administrator.";
        return res.status(403).json({
          success: false,
          message: blockMsg
        });
      }
    }

    // Exclude password field
    delete user.password;

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Session invalid or expired.",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden. Admin access required.",
    });
  }
};
