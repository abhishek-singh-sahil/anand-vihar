import { prisma } from "../config/db.js";
import { sendOrderConfirmationEmail, sendOrderAlertEmail } from "../utils/email.js";

// Place Order
export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      addressId, 
      paymentMethod = "COD", 
      couponCode, 
      notes = "",
      customAddress
    } = req.body;

    // Get Cart Items with Variant information
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { 
        product: true,
        variant: true
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    // Get Address details
    let address = null;
    if (addressId) {
      address = await prisma.address.findUnique({ where: { id: addressId } });
    } else if (customAddress) {
      address = customAddress;
    } else {
      address = await prisma.address.findFirst({
        where: { userId, isDefault: true }
      });
    }

    if (!address) {
      return res.status(400).json({ success: false, message: "Delivery address is required." });
    }

    // Validate PIN Code Zone Availability
    const pinZone = await prisma.pinCodeZone.findUnique({
      where: { code: address.pinCode }
    });
    if (!pinZone || !pinZone.active) {
      return res.status(400).json({
        success: false,
        message: `Sorry, Delivery is not available in your area (${address.pinCode}).`
      });
    }

    const shippingCharge = pinZone.deliveryCharge;

    // Calculate subtotal based on variants
    let subtotal = 0;
    for (const item of cartItems) {
      if (!item.variant) {
        return res.status(400).json({ success: false, message: `Please configure weight variant for ${item.product.name}.` });
      }

      // Check stock availability
      if (item.variant.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.product.name} (${item.variant.weight}). Only ${item.variant.stock} left.` 
        });
      }

      const price = item.variant.price - (item.variant.discount || 0);
      subtotal += price * item.quantity;
    }

    // Handle coupon code discount
    let discountAmount = 0;
    let finalCoupon = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() }
      });
      if (coupon && coupon.active && new Date() <= coupon.expiryDate && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }
        finalCoupon = coupon;
      }
    }

    const grandTotal = subtotal - discountAmount + shippingCharge;

    // Generate unique order tracking number: AV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `AV-${dateStr}-${randomSuffix}`;

    // Perform database writes in transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order record
      const ord = await tx.order.create({
        data: {
          orderNumber,
          userId,
          paymentMethod,
          totalAmount: subtotal - discountAmount,
          shippingCharge,
          grandTotal,
          notes,
          name: address.fullName,
          phone: address.phone,
          state: address.state,
          city: address.city,
          pinCode: address.pinCode,
          houseNumber: address.houseNumber,
          street: address.street,
          landmark: address.landmark || "",
          status: "pending"
        }
      });

      // 2. Create order items & Decrement stock
      for (const item of cartItems) {
        const itemPrice = item.variant.price - (item.variant.discount || 0);
        await tx.orderItem.create({
          data: {
            orderId: ord.id,
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name,
            weight: item.variant.weight,
            price: itemPrice,
            quantity: item.quantity,
            image: item.product.image
          }
        });

        // Decrement product variant stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });

        // Trigger low stock logging/alerts for admin
        const remainingStock = item.variant.stock - item.quantity;
        if (remainingStock <= 5) {
          console.warn(`[LOW STOCK ALERT] Product: ${item.product.name} (${item.variant.weight}) stock is running low: Only ${remainingStock} left.`);
        }
      }

      // 3. Increment coupon usage if used
      if (finalCoupon) {
        await tx.coupon.update({
          where: { id: finalCoupon.id },
          data: { usageCount: { increment: 1 } }
        });
      }

      // 4. Wipe cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return ord;
    });

    // Fetch newly created order items for email payload
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id }
    });

    // Send emails in background
    sendOrderConfirmationEmail(req.user.email, order, orderItems).catch(console.error);
    sendOrderAlertEmail(order, orderItems).catch(console.error);

    // Fetch config WhatsApp number
    let adminWhatsappSetting = await prisma.setting.findUnique({
      where: { key: "whatsappNumber" }
    });
    const receiverNumber = adminWhatsappSetting ? adminWhatsappSetting.value : "+919934190109";

    // Build WhatsApp Order Redirection pre-filled text
    let message = `*Anand Vihar Sweet Shop Order*\n`;
    message += `*Order Number*: ${order.orderNumber}\n`;
    message += `*Customer Name*: ${order.name}\n`;
    message += `*Phone*: ${order.phone}\n`;
    message += `*Items Ordered*:\n`;
    orderItems.forEach(item => {
      message += `- ${item.name} (${item.weight}) (Qty: ${item.quantity}) - ₹${item.price * item.quantity}\n`;
    });
    message += `\n*Subtotal*: ₹${order.totalAmount}\n`;
    message += `*Shipping*: ₹${order.shippingCharge}\n`;
    message += `*Grand Total*: ₹${order.grandTotal}\n\n`;
    message += `*Delivery Address*:\n`;
    message += `${order.houseNumber}, ${order.street}, ${order.landmark ? order.landmark + ', ' : ''}${order.city}, ${order.state} - ${order.pinCode}\n\n`;
    message += `*Payment Method*: ${order.paymentMethod}\n`;
    if (order.notes) {
      message += `*Notes*: ${order.notes}\n`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(receiverNumber)}&text=${encodeURIComponent(message)}`;

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
      whatsappUrl
    });
  } catch (error) {
    next(error);
  }
};

// Customer order history
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// Get single order details
export const getOrderDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId && role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// Admin list all orders
export const adminGetOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// Admin update order status
export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, preparing, packed, shipped, delivered, cancelled

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    next(error);
  }
};

// Admin delete order
export const adminDeleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    next(error);
  }
};
