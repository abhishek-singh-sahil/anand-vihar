import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function GalleryPreview() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get("/gallery");
        if (res.data.success && res.data.items) {
          setItems(res.data.items.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to fetch gallery items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Compute total list to display (fill up to 6 with vacant slots)
  const displayItems = [...items];
  const vacantCount = Math.max(0, 6 - displayItems.length);
  for (let i = 0; i < vacantCount; i++) {
    displayItems.push({ _id: `vacant-${i}`, isVacant: true });
  }

  return (
    <section className="py-16 md:py-24 bg-[#FAF5EF] relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute -top-40 left-0 h-[350px] w-[350px] rounded-full bg-[#ff9248]/5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#013e37]/5 blur-[100px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37] text-xs sm:text-sm uppercase tracking-wider mb-4">
            Gallery Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#013e37] tracking-tight">
            A Glimpse of Our Delicious World
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            Every sweet, every dish, and every corner of Anand Vihar reflects quality, freshness, and the warmth of our hospitality.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item, index) => {
            const isLarge = index === 0;
            
            if (item.isVacant) {
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`
                    border-2 border-dashed border-gray-200 rounded-[20px] sm:rounded-[28px] flex flex-col items-center justify-center aspect-square bg-[#FAF5EF]/40 text-gray-400 select-none
                    ${isLarge ? "col-span-2 row-span-2 aspect-auto h-full min-h-[220px]" : ""}
                  `}
                >
                  <Camera size={26} className="mb-2 text-gray-300" />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider">Vacant Slot</span>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className={`
                  relative overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-sm hover:shadow-md cursor-pointer aspect-square bg-white border border-gray-100 group transition duration-300
                  ${isLarge ? "col-span-2 row-span-2 aspect-auto h-full" : ""}
                `}
              >
                {item.type === "video" ? (
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                    <video
                      src={item.url}
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="relative z-10 w-12 h-12 rounded-full bg-[#ff9248] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play size={20} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title || "Gallery Showcase"}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Cover Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 text-white text-left">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#ffefb3]">
                    {item.category || "Gallery"}
                  </span>
                  <h4 className="text-sm sm:text-lg font-bold mt-1 line-clamp-1 leading-snug">
                    {item.title || "Gallery Item"}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 rounded-full bg-[#ff9248] hover:bg-[#ea5a00] px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer no-underline"
          >
            View Complete Gallery
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default GalleryPreview;