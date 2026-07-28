import express from "express";
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from "../controllers/cart.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCartQuantity);
router.delete("/:id", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
