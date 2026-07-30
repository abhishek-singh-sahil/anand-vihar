import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/menu/categories");
        if (res.data?.success) {
          // Filter active categories
          const activeCats = (res.data.categories || []).filter(c => c.status !== false);
          setCategories(activeCats);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-white flex items-center justify-center font-sans">
        <div className="text-gray-400 font-semibold animate-pulse">Loading categories...</div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-[#FDFCFA] font-sans">
      <div className="section relative">
        {/* Header section with inline navigation arrows */}
        <div className="flex justify-between items-end gap-3 mb-6">
          <div>
            <span className="inline-block bg-[#ffefb3] text-[#013e37] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
              Explore Collections
            </span>
            <h2 className="mt-2 text-xl sm:text-3xl font-extrabold text-[#013e37] leading-tight">
              Browse By Category
            </h2>
          </div>

          {/* Navigation Controls */}
          {categories.length > 4 && (
            <div className="flex gap-2 shrink-0 mb-1">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:bg-orange-50 hover:text-[#ff9248] text-[#013e37] flex items-center justify-center cursor-pointer transition shadow-sm"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:bg-orange-50 hover:text-[#ff9248] text-[#013e37] flex items-center justify-center cursor-pointer transition shadow-sm"
                aria-label="Scroll Right"
              >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Categories Carousel Slider */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none py-2 px-1 snap-x scroll-smooth"
        >
          {categories.map((cat, index) => {
            const catId = cat.id || cat._id;
            return (
              <motion.div
                key={catId}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/menu?category=${encodeURIComponent(cat.name)}`)}
                className="w-36 sm:w-44 bg-white border border-gray-200 rounded-3xl p-2.5 sm:p-3 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300 text-center shrink-0 cursor-pointer snap-start flex flex-col items-center select-none group"
              >
                {/* Category Image Box */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-[#ffefb3]/20 via-orange-50/30 to-[#ff9248]/10 flex items-center justify-center mb-3 border border-gray-50/50 relative">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-serif font-black text-[#ff9248]/80 drop-shadow-sm select-none">
                      {cat.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-extrabold text-gray-800 text-xs sm:text-sm line-clamp-1 group-hover:text-[#ff9248] transition-colors duration-200">
                  {cat.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;