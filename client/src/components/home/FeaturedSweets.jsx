import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { toast } from "react-hot-toast";
import api from "../../services/api";

function FeaturedSweets() {
  const { settings, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await api.get("/menu/items?limit=24");
        if (res.data?.success) {
          const items = res.data.items || [];
          setSweets(items);
        }
      } catch (err) {
        console.error("Failed to fetch sweets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  const slideNext = () => {
    if (startIndex + 6 < sweets.length) {
      setStartIndex((prev) => prev + 6);
    }
  };

  const slidePrev = () => {
    if (startIndex - 6 >= 0) {
      setStartIndex((prev) => prev - 6);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-[#FDFCFA] flex items-center justify-center font-sans">
        <div className="text-gray-400 font-semibold animate-pulse">Loading menu...</div>
      </div>
    );
  }

  if (sweets.length === 0) return null;

  // Items visible in the desktop slider
  const visibleDesktopItems = sweets.slice(startIndex, startIndex + 6);
  // Items visible in the mobile grid (up to 12)
  const visibleMobileItems = sweets.slice(0, 12);

  return (
    <section className="py-10 bg-[#FDFCFA] font-sans">
      <div className="section">
        
        {/* Header section with heading and desktop slide indicators */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="inline-block bg-[#ffefb3] text-[#013e37] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
              Signature Treats
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#013e37]">
              Our Most Loved Sweets
            </h2>
          </div>

          {/* Desktop Slider Arrows */}
          <div className="hidden md:flex gap-2 items-center">
            <button
              onClick={slidePrev}
              disabled={startIndex === 0}
              className={`w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition shadow-sm ${
                startIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-orange-50 hover:text-[#ff9248]"
              }`}
              aria-label="Slide Previous 6"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-gray-400 font-mono px-2">
              {startIndex + 1}-{Math.min(startIndex + 6, sweets.length)} of {sweets.length}
            </span>
            <button
              onClick={slideNext}
              disabled={startIndex + 6 >= sweets.length}
              className={`w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition shadow-sm ${
                startIndex + 6 >= sweets.length ? "opacity-40 cursor-not-allowed" : "hover:bg-orange-50 hover:text-[#ff9248]"
              }`}
              aria-label="Slide Next 6"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── DESKTOP SLIDER LAYOUT ── */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <AnimatePresence mode="wait">
              {visibleDesktopItems.map((item, idx) => {
                const hasDiscount = item.discount > 0;
                const displayPrice = item.price;
                const originalPrice = hasDiscount ? Math.round(item.price / (1 - item.discount / 100)) : null;

                return (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.bestseller && (
                          <span className="absolute left-2 top-2 bg-[#ff9248] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                            Best
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1 shrink-0">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-bold text-gray-500">4.9</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      {/* Pricing */}
                      <div className="flex items-baseline gap-1.5 mb-2.5">
                        <span className="text-base font-extrabold text-[#ff9248]">
                          ₹{displayPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-gray-400 line-through font-semibold">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>

                      {settings?.orderingEnabled && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              toast.error("Please login to buy sweets!");
                              navigate("/login");
                              return;
                            }
                            const success = await addToCart(item._id, 1);
                            if (success) {
                              toast.success(`Added ${item.name} to cart!`);
                            } else {
                              toast.error("Failed to add to cart.");
                            }
                          }}
                          className="w-full py-2 bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition shadow-sm border-none cursor-pointer"
                        >
                          <ShoppingBag size={11} />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── MOBILE GRID LAYOUT (2 Columns x 6 Rows = Max 12 Products) ── */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3.5">
            {visibleMobileItems.map((item, idx) => {
              const hasDiscount = item.discount > 0;
              const displayPrice = item.price;
              const originalPrice = hasDiscount ? Math.round(item.price / (1 - item.discount / 100)) : null;

              return (
                <div
                  key={item._id || idx}
                  className="bg-white border border-gray-100 rounded-2xl p-2.5 shadow-sm flex flex-col justify-between cursor-pointer"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <div>
                    {/* Compact Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.bestseller && (
                        <span className="absolute left-1.5 top-1.5 bg-[#ff9248] text-white text-[8px] font-bold uppercase px-1 py-0.5 rounded shadow-sm">
                          Best
                        </span>
                      )}
                    </div>

                    {/* Compact Info */}
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs line-clamp-1 leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-[9px] font-bold text-gray-500">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    {/* Compact Pricing */}
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-sm font-extrabold text-[#ff9248]">
                        ₹{displayPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-[9px] text-gray-400 line-through font-semibold">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>

                    {settings?.orderingEnabled && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            toast.error("Please login to buy sweets!");
                            navigate("/login");
                            return;
                          }
                          const success = await addToCart(item._id, 1);
                          if (success) {
                            toast.success(`Added ${item.name} to cart!`);
                          } else {
                            toast.error("Failed to add to cart.");
                          }
                        }}
                        className="w-full py-1.5 bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 text-white text-[9px] font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-sm border-none cursor-pointer"
                      >
                        <ShoppingBag size={10} />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Menu Redirect banner for Mobile at the end */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/menu")}
              className="w-full py-3.5 bg-[#013e37] hover:bg-[#025347] text-[#ffefb3] font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-md"
            >
              Explore Full Menu Collection
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturedSweets;