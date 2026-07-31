import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const galleryCategories = [
  "All",
  "Restaurant",
  "Sweets",
  "Interior",
  "Kitchen",
  "Festival",
  "Events",
];

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null); // active item index in filtered list

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/gallery?onlyGallery=true&category=${category}`);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [category]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const activeMedia = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6 bg-[#FDFCFA] font-sans">
      {/* Page Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#013e37] mb-4">Our Gallery</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          A visual journey through our rich sweet heritage, clean kitchens, and vibrant restaurant spaces.
        </p>

        {/* Category Pill Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                category === cat
                  ? "bg-[#ff9248] text-white shadow-sm"
                  : "bg-white text-[#013e37] border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="text-center py-20 font-semibold text-gray-500">Loading gallery media...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 font-semibold text-gray-500">
          No media files found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-square bg-gray-100 cursor-pointer"
            >
              {item.type === "video" ? (
                <div className="w-full h-full relative">
                  <video src={item.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white text-3xl group-hover:scale-110 transition duration-300">
                    ▶
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
              )}
              
              {/* Hover description banner */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] text-[#ffefb3] font-bold uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="text-white font-bold text-lg leading-tight">{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-6 text-white"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white text-3xl hover:text-orange-400 font-bold focus:outline-none cursor-pointer"
            >
              ✕
            </button>

            {/* Carousel navigation buttons */}
            {items.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-2xl flex items-center justify-center cursor-pointer"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-2xl flex items-center justify-center cursor-pointer"
                >
                  &gt;
                </button>
              </>
            )}

            {/* Media renderer */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90%] max-h-[75%] rounded-xl overflow-hidden bg-black flex items-center justify-center"
            >
              {activeMedia.type === "video" ? (
                <video src={activeMedia.url} controls autoPlay className="max-w-full max-h-full object-contain" />
              ) : (
                <img src={activeMedia.url} alt={activeMedia.title} className="max-w-full max-h-full object-contain" />
              )}
            </div>

            {/* Captions */}
            <div className="text-center mt-6 max-w-xl">
              <span className="text-xs text-[#ff9248] font-bold uppercase tracking-wider">
                {activeMedia.category}
              </span>
              <h3 className="text-xl font-bold mt-1">{activeMedia.title}</h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
