import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter a valid email address");
    }

    setSubmitting(true);
    try {
      const res = await api.post("/contact/subscribe", { email });
      if (res.data.success) {
        toast.success(res.data.message || "Subscribed successfully!");
        setEmail("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Already subscribed or failed to subscribe");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[var(--bg-main)] font-sans">
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] bg-[#013e37] px-8 py-16 text-center shadow-2xl md:px-16"
        >
          {/* Decorative Background */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#ff9248]/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#ffefb3]/10 blur-3xl"></div>

          {/* Icon */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ff9248] shadow-lg">
            <Mail size={38} color="white" />
          </div>

          {/* Heading */}
          <span className="relative mt-8 inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">
            Stay Connected
          </span>

          <h2 className="relative mt-6 text-4xl font-bold leading-tight text-white lg:text-5xl">
            Never Miss Our
            <br />
            Latest Offers
          </h2>

          <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Subscribe to receive festival offers, exclusive discounts,
            new menu launches and exciting updates from
            <span className="font-semibold text-[#ffefb3]">
              {" "}Anand Vihar Restaurant & Sweet Shop
            </span>.
          </p>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="relative mx-auto mt-12 flex max-w-2xl flex-col gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-16 flex-1 rounded-full border-none px-8 text-lg outline-none text-gray-800"
              required
            />

            <button
              type="submit"
              disabled={submitting}
              className="flex h-16 items-center justify-center gap-3 rounded-full bg-[#ff9248] px-10 text-lg font-semibold text-white transition duration-300 hover:scale-105 hover:bg-[#ffa242] cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
              <Send size={18} />
            </button>
          </form>

          {/* Bottom Text */}
          <p className="relative mt-6 text-sm text-white/60">
            We respect your privacy. No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Newsletter;