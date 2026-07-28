import express from "express";
import { 
  placeOrder, 
  getMyOrders, 
  getOrderDetails, 
  adminGetOrders, 
  adminUpdateOrderStatus, 
  adminDeleteOrder 
} from "../controllers/order.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

router.post("/", protect, sanitizeInput, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderDetails);

// Admin-only routes
router.get("/", protect, adminOnly, adminGetOrders);
router.put("/:id/status", protect, adminOnly, sanitizeInput, adminUpdateOrderStatus);
router.delete("/:id", protect, adminOnly, adminDeleteOrder);

export default router;
