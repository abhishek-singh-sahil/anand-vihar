import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCart(guestCart);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/cart");
      if (res.data?.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mergeCart = async () => {
      if (isAuthenticated) {
        setLoading(true);
        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            try {
              await api.post("/cart", {
                productId: item.productId,
                quantity: item.quantity,
                variantId: item.variantId
              });
            } catch (err) {
              console.error("Error merging item:", err);
            }
          }
          localStorage.removeItem("guest_cart");
        }
        await fetchCart();
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        setCart(guestCart);
      }
    };
    mergeCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    if (!isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.get(`/menu/items/${productId}`);
        if (!res.data?.success || !res.data.product) {
          return false;
        }
        
        const product = res.data.product;
        const selectedVariant = variantId 
          ? product.variants.find(v => v.id === variantId)
          : product.variants[0];

        const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
        
        const existingItemIndex = guestCart.findIndex(
          item => item.productId === productId && item.variantId === (selectedVariant?.id || null)
        );

        if (existingItemIndex > -1) {
          guestCart[existingItemIndex].quantity += quantity;
        } else {
          const newCartItem = {
            id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            productId,
            quantity,
            variantId: selectedVariant?.id || null,
            price: selectedVariant?.price || product.price || 0,
            discount: selectedVariant?.discount || product.discount || 0,
            weight: selectedVariant?.weight || product.weight || "",
            product: {
              id: product.id,
              _id: product.id,
              name: product.name,
              image: product.image,
              categories: product.categories.map(c => c.name || c),
              variants: product.variants
            }
          };
          guestCart.push(newCartItem);
        }

        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        setCart(guestCart);
        return true;
      } catch (err) {
        console.error("Add to guest cart error:", err);
        return false;
      } finally {
        setLoading(false);
      }
    }

    try {
      const res = await api.post("/cart", { productId, quantity, variantId });
      if (res.data?.success) {
        setCart(res.data.cart || []);
        return true;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
    return false;
  };

  const updateQuantity = async (id, quantity) => {
    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const item = guestCart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("guest_cart", JSON.stringify(guestCart));
        setCart(guestCart);
      }
      return;
    }
    try {
      const res = await api.put(`/cart/${id}`, { quantity });
      if (res.data?.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const updateCartItemVariant = async (id, variantId) => {
    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const item = guestCart.find(item => item.id === id);
      if (item) {
        const newVariant = item.product.variants.find(v => v.id === variantId);
        if (newVariant) {
          item.variantId = variantId;
          item.price = newVariant.price;
          item.discount = newVariant.discount || 0;
          item.weight = newVariant.weight || "";
          localStorage.setItem("guest_cart", JSON.stringify(guestCart));
          setCart(guestCart);
          return true;
        }
      }
      return false;
    }
    try {
      const res = await api.put(`/cart/${id}`, { variantId });
      if (res.data?.success) {
        setCart(res.data.cart || []);
        return true;
      }
    } catch (err) {
      console.error("Update variant error:", err);
    }
    return false;
  };

  const removeFromCart = async (id) => {
    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const updatedCart = guestCart.filter(item => item.id !== id);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return;
    }
    try {
      const res = await api.delete(`/cart/${id}`);
      if (res.data?.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem("guest_cart");
      setCart([]);
      return;
    }
    try {
      const res = await api.delete("/cart");
      if (res.data?.success) {
        setCart([]);
      }
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, updateCartItemVariant, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
