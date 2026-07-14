import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/db.js";

// Routes imports
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import reservationRoutes from "./routes/reservation.js";
import testimonialRoutes from "./routes/testimonial.js";
import blogRoutes from "./routes/blog.js";
import galleryRoutes from "./routes/gallery.js";
import contactRoutes from "./routes/contact.js";
import analyticsRoutes from "./routes/analytics.js";
import settingRoutes from "./routes/setting.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

/* -------------------------------------------------------------------------- */
/*                                   SECURITY                                 */
/* -------------------------------------------------------------------------- */

// 1. Helmet security headers
app.use(helmet());

// 2. Rate limiter: max 300 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, 
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// 3. CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://anand-vihar-restaurant.vercel.app", // placeholder deployment URLs
  "https://anand-vihar.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// 4. Data sanitization against NoSQL query injection
app.use(mongoSanitize());

/* -------------------------------------------------------------------------- */
/*                                 PARSERS                                    */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Anand Vihar Restaurant & Sweet Shop API running successfully.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingRoutes);

/* -------------------------------------------------------------------------- */
/*                                404 HANDLER                                 */
/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested API resource not found.",
  });
});

/* -------------------------------------------------------------------------- */
/*                             GLOBAL ERROR HANDLER                           */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {
  console.error("Server Error Hook:", err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

/* -------------------------------------------------------------------------- */
/*                                   STARTUP                                  */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
});
