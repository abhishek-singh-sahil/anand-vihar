import { prisma } from "../config/db.js";

// Get user's cart items
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { 
            categories: true,
            variants: { where: { active: true }, orderBy: { price: "asc" } }
          }
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
          available: item.product.available,
          variants: item.product.variants || []
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
          include: { 
            categories: true,
            variants: { where: { active: true }, orderBy: { price: "asc" } }
          }
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
          available: item.product.available,
          variants: item.product.variants || []
        }
      };
    });

    res.status(200).json({ success: true, message: "Added to cart successfully", cart: mappedItems });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity or variant
export const updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity, variantId } = req.body;

    const currentItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!currentItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    if (quantity !== undefined) {
      if (Number(quantity) <= 0) {
        await prisma.cartItem.delete({ where: { id } });
      } else {
        await prisma.cartItem.update({
          where: { id },
          data: { quantity: Number(quantity) }
        });
      }
    }

    if (variantId !== undefined && variantId !== currentItem.variantId) {
      // Validate the target variant exists
      const targetVariant = await prisma.productVariant.findUnique({
        where: { id: variantId }
      });
      if (!targetVariant || !targetVariant.active) {
        return res.status(404).json({ success: false, message: "Variant not found or inactive" });
      }

      // Check if another item with the same product and target variant already exists in cart
      const duplicateItem = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: currentItem.productId,
          variantId,
          id: { not: id }
        }
      });

      if (duplicateItem) {
        // Merge quantities and remove current
        const newQty = duplicateItem.quantity + (quantity !== undefined ? Number(quantity) : currentItem.quantity);
        await prisma.cartItem.update({
          where: { id: duplicateItem.id },
          data: { quantity: newQty }
        });
        await prisma.cartItem.delete({ where: { id } });
      } else {
        // Just update variantId
        await prisma.cartItem.update({
          where: { id },
          data: { variantId }
        });
      }
    }

    // Return updated cart items list
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { 
            categories: true,
            variants: { where: { active: true }, orderBy: { price: "asc" } }
          }
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
          available: item.product.available,
          variants: item.product.variants || []
        }
      };
    });

    res.status(200).json({ success: true, message: "Cart updated successfully", cart: mappedItems });
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
          include: { 
            categories: true,
            variants: { where: { active: true }, orderBy: { price: "asc" } }
          }
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
          available: item.product.available,
          variants: item.product.variants || []
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
