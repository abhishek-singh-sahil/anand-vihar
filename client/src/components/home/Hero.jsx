import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

// Fallback slides in case DB has no banners
const fallbackSlides = [
  {
    id: "fallback-1",
    image: "https://res.cloudinary.com/kd9q79hf/image/upload/v1721287950/sweet3.jpg",
    link: "/menu"
  },
  {
    id: "fallback-2",
    image: "https://res.cloudinary.com/kd9q79hf/image/upload/v1721287950/sweet1.jpg",
    link: "/menu"
  }
];

function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners");
        if (res.data?.success && res.data.banners?.length > 0) {
          setSlides(res.data.banners);
        } else {
          setSlides(fallbackSlides);
        }
      } catch (err) {
        console.error("Failed to fetch banners, using fallbacks:", err);
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500); // Cycle every 4.5s
    return () => clearInterval(interval);
  }, [slides]);

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] min-h-[300px] md:min-h-[450px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 font-semibold animate-pulse">Loading hero slideshow...</div>
      </div>
    );
  }

  const activeSlide = slides[current];

  return (
    <section className="w-full relative overflow-hidden bg-white">
      <div 
        onClick={() => activeSlide?.link && navigate(activeSlide.link)}
        className={`w-full relative aspect-[21/9] min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[480px] bg-gray-50 select-none overflow-hidden ${
          activeSlide?.link ? "cursor-pointer" : ""
        }`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={activeSlide.id || activeSlide._id || current}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Banner Image */}
            <img
              src={activeSlide.image}
              alt={activeSlide.title || "Banner"}
              className="w-full h-full object-cover"
              draggable="false"
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Arrow Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition border-none shadow-md backdrop-blur-sm z-30"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition border-none shadow-md backdrop-blur-sm z-30"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2.5 z-30">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(idx);
                  }}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 border-none ${
                    current === idx ? "bg-[#ff9248] scale-125 shadow-md" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Hero;