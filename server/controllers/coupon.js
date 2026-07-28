import { prisma } from "../config/db.js";

// Validate coupon code
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.active) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code" });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: "Coupon code has expired" });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit has been reached" });
    }

    if (Number(orderAmount) < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} is required for this coupon.`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (Number(orderAmount) * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Cap discount to order amount
    if (discountAmount > Number(orderAmount)) {
      discountAmount = Number(orderAmount);
    }

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin list coupons
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { expiryDate: "desc" }
    });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// Admin create coupon
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const exists = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });
    if (exists) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0.0,
        expiryDate: new Date(expiryDate),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        active: true
      }
    });

    res.status(201).json({ success: true, message: "Coupon created successfully", coupon });
  } catch (error) {
    next(error);
  }
};

// Admin delete coupon
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Admin update coupon
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit, active } = req.body;

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(minOrderAmount !== undefined && { minOrderAmount: Number(minOrderAmount) }),
        ...(expiryDate && { expiryDate: new Date(expiryDate) }),
        ...(usageLimit !== undefined && { usageLimit: usageLimit ? Number(usageLimit) : null }),
        ...(active !== undefined && { active: active === true || active === "true" })
      }
    });

    res.status(200).json({ success: true, message: "Coupon updated successfully", coupon: updated });
  } catch (error) {
    next(error);
  }
};
