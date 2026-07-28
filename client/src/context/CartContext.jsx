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
      setCart([]);
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
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    if (!isAuthenticated) return false;
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
    try {
      const res = await api.put(`/cart/${id}`, { quantity });
      if (res.data?.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const removeFromCart = async (id) => {
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
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
