import { prisma } from "../config/db.js";

// Get user's cart items
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { categories: true }
        },
        variant: true
      }
    });

    const mappedItems = items.map(item => {
      const price = item.variant ? item.variant.price : 0.0;
      const discount = item.variant ? item.variant.discount : 0.0;
      const weight = item.variant ? item.variant.weight : "";
      const stock = item.variant ? item.variant.stock : 0;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        weight,
        price,
        discount,
        stock,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          image: item.product.image,
          categories: item.product.categories.map(c => c.name),
          available: item.product.available
        }
      };
    });

    res.status(200).json({ success: true, cart: mappedItems });
  } catch (error) {
    next(error);
  }
};

// Add product (or variant) to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Resolve variant: if not provided, select the cheapest active variant
    let targetVariantId = variantId;
    if (targetVariantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: targetVariantId } });
      if (!variant || !variant.active) {
        return res.status(404).json({ success: false, message: "Product variant not found or inactive" });
      }
    } else {
      const firstVariant = await prisma.productVariant.findFirst({
        where: { productId, active: true },
        orderBy: { price: "asc" }
      });
      if (!firstVariant) {
        return res.status(400).json({ success: false, message: "No active variants available for this sweet." });
      }
      targetVariantId = firstVariant.id;
    }

    // Check if exact item + variant already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantId: targetVariantId
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + Number(quantity) }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          variantId: targetVariantId,
          quantity: Number(quantity)
        }
      });
    }

    // Return full updated cart
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { categories: true }
        },
        variant: true
      }
    });

    const mappedItems = items.map(item => {
      const price = item.variant ? item.variant.price : 0.0;
      const discount = item.variant ? item.variant.discount : 0.0;
      const weight = item.variant ? item.variant.weight : "";
      const stock = item.variant ? item.variant.stock : 0;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        weight,
        price,
        discount,
        stock,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          categories: item.product.categories.map(c => c.name),
          available: item.product.available
        }
      };
    });

    res.status(200).json({ success: true, message: "Added to cart successfully", cart: mappedItems });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (Number(quantity) <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity: Number(quantity) }
      });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { categories: true }
        },
        variant: true
      }
    });

    const mappedItems = items.map(item => {
      const price = item.variant ? item.variant.price : 0.0;
      const discount = item.variant ? item.variant.discount : 0.0;
      const weight = item.variant ? item.variant.weight : "";
      const stock = item.variant ? item.variant.stock : 0;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        weight,
        price,
        discount,
        stock,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          categories: item.product.categories.map(c => c.name),
          available: item.product.available
        }
      };
    });

    res.status(200).json({ success: true, message: "Cart updated", cart: mappedItems });
  } catch (error) {
    next(error);
  }
};

// Remove single item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.cartItem.delete({ where: { id } });

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { categories: true }
        },
        variant: true
      }
    });

    const mappedItems = items.map(item => {
      const price = item.variant ? item.variant.price : 0.0;
      const discount = item.variant ? item.variant.discount : 0.0;
      const weight = item.variant ? item.variant.weight : "";
      const stock = item.variant ? item.variant.stock : 0;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        weight,
        price,
        discount,
        stock,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          categories: item.product.categories.map(c => c.name),
          available: item.product.available
        }
      };
    });

    res.status(200).json({ success: true, message: "Item removed from cart", cart: mappedItems });
  } catch (error) {
    next(error);
  }
};

// Clear entire cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.status(200).json({ success: true, message: "Cart cleared successfully", cart: [] });
  } catch (error) {
    next(error);
  }
};
