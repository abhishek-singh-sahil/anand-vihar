import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        toast.success("Reset code sent! Check your inbox.");
        // Redirect to reset password page, passing email in state
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#FDFCFA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff9248] text-2xl font-bold">
            🔑
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email address and we'll send you a 6-digit OTP code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
              placeholder="name@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send Reset Code"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/login" className="text-sm font-semibold text-[#013e37] hover:text-[#ff9248] transition-colors">
            Back to Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
