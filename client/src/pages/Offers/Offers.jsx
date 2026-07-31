import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Copy, Check, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import OfferHero from "../../assets/images/offers-banner.jpg";

function Offers() {
  const { settings } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");

  const freeDeliveryMinAmount = settings?.freeDeliveryMinAmount 
    ? Number(settings.freeDeliveryMinAmount) 
    : 500;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/coupons/public");
        if (res.data.success) {
          setCoupons(res.data.coupons || []);
        }
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <main className="bg-[#FDFCFA] font-sans min-h-screen pb-16">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-[#FAF5EF] py-12 md:py-20 px-4 sm:px-6">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#ff9248]/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[#013e37]/10 blur-[150px]" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff9248]/10 text-[#ff9248] text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={12} />
                <span>Exclusive Offers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#013e37] tracking-tight">
                Save More With
                <span className="text-[#ff9248]"> Every Order</span>
              </h1>

              <p className="mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 max-w-xl">
                Discover exciting discount coupons and special saving benefits available only at Anand Vihar Sweet Shop. Apply active promo codes during checkout to enjoy delicious rewards.
              </p>

              <div className="mt-8">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-3 rounded-full bg-[#ff9248] hover:bg-[#ea5a00] px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer no-underline"
                >
                  Explore Sweets Menu
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full"
            >
              <div className="absolute inset-0 rounded-[32px] bg-[#ff9248]/10 blur-2xl" />
              <div className="relative rounded-[32px] overflow-hidden border border-gray-100 shadow-xl h-[280px] sm:h-[360px] lg:h-[400px]">
                <img
                  src={OfferHero}
                  alt="Exclusive Offers Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-12 sm:mt-16 space-y-12">
        
        {/* 1. FREE DELIVERY BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#013e37] to-[#045148] p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,146,72,0.12),transparent_50%)]" />
          
          <div className="relative z-10 flex items-center gap-4 text-left">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-[#ff9248]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl text-stone-300 font-bold">Free Shipping Offer!</h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                Order sweets worth ₹{freeDeliveryMinAmount} or more to get free doorstep delivery.
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <span className="inline-block bg-[#ff9248] text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full shadow-md">
              Above ₹{freeDeliveryMinAmount} Only
            </span>
          </div>
        </motion.div>

        {/* 2. COUPONS LIST */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#013e37]">Available Coupon Codes</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tap any coupon code below to copy it directly to your clipboard.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-semibold">Loading available offers...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-semibold border border-dashed border-gray-200 rounded-3xl bg-white p-8">
              No coupon codes are currently active. Please check back later!
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {coupons.map((coupon, index) => {
                const isExpired = new Date() > new Date(coupon.expiryDate) || !coupon.active;
                const isCopied = copiedCode === coupon.code;
                
                return (
                  <motion.div
                    key={coupon.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => !isExpired && handleCopy(coupon.code)}
                    className={`
                      relative p-6 rounded-3xl border text-left flex flex-col justify-between min-h-[160px] transition duration-300 bg-white
                      ${isExpired 
                        ? "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed select-none" 
                        : "border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                      }
                    `}
                  >
                    <div>
                      {/* Top Row: Discount Value & Status */}
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#013e37]">
                          {coupon.discountType === "PERCENTAGE" 
                            ? `${coupon.discountValue}% OFF` 
                            : `₹${coupon.discountValue} OFF`
                          }
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isExpired 
                            ? "bg-red-50 text-red-500" 
                            : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {isExpired ? "Expired" : "Active"}
                        </span>
                      </div>

                      {/* Minimum Order Hint */}
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        Valid on orders above <span className="font-bold text-slate-700">₹{coupon.minOrderAmount || 0}</span>
                      </p>
                    </div>

                    {/* Bottom Row: Copy Code & Expiration */}
                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                      {/* Code Block */}
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm sm:text-base font-bold tracking-wider px-3 py-1.5 rounded-lg border ${
                          isExpired 
                            ? "bg-gray-100 border-gray-200 text-gray-400" 
                            : "bg-orange-50/50 border-orange-100 text-[#ff9248] group-hover:bg-[#ff9248] group-hover:text-white transition duration-300"
                        }`}>
                          {coupon.code}
                        </span>
                        {!isExpired && (
                          <div className="text-gray-400 group-hover:text-[#ff9248] transition-colors">
                            {isCopied ? <Check size={16} className="text-emerald-500 animate-bounce" /> : <Copy size={15} />}
                          </div>
                        )}
                      </div>

                      {/* Expiry Date */}
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                        Exp: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tap to Copy Overlay hint */}
                    {!isExpired && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[10px] font-bold text-[#ff9248]">
                        <Info size={10} />
                        <span>Tap to copy</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </section>

    </main>
  );
}

export default Offers;