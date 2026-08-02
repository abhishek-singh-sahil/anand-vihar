import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    reservationsEnabled: true,
    orderingEnabled: true,
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.warn("Could not retrieve user profile:", error.message);
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.warn("Could not retrieve system settings:", error.message);
    }
  };

  const updateSystemSettings = async (newSettings) => {
    try {
      const response = await api.put("/settings", newSettings);
      if (response.data.success) {
        setSettings(response.data.settings);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update settings" };
    }
  };

  useEffect(() => {
    // Load settings always
    fetchSettings();

    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    // Listen to global logout events from api interceptor
    const handleLogoutEvent = () => {
      setUser(null);
    };

    window.addEventListener("auth-logout", handleLogoutEvent);
    return () => window.removeEventListener("auth-logout", handleLogoutEvent);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
        // Reload settings upon login just in case
        fetchSettings();
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  };

  const loginWithGoogle = async (credential, profile = null) => {
    try {
      const response = await api.post("/auth/google", { credential, profile });
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
        fetchSettings();
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Google Login failed" };
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setUser(response.data.user);
        fetchSettings();
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "OTP verification failed" };
    }
  };

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed on server:", error.message);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const updateProfile = async (formData) => {
    try {
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await api.put("/auth/change-password", passwords);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Password change failed" };
    }
  };

  const isAdmin = user && user.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        settings,
        login,
        loginWithGoogle,
        registerUser,
        verifyOtp,
        logoutUser,
        updateProfile,
        changePassword,
        fetchProfile,
        fetchSettings,
        updateSystemSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
