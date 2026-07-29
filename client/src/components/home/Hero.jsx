import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

// Fallback slides in case DB has no banners
const fallbackDesktopSlides = [
  {
    id: "fallback-d-1",
    image: "https://res.cloudinary.com/kd9q79hf/image/upload/v1721287950/sweet3.jpg",
    link: "/menu"
  },
  {
    id: "fallback-d-2",
    image: "https://res.cloudinary.com/kd9q79hf/image/upload/v1721287950/sweet1.jpg",
    link: "/menu"
  }
];

const fallbackMobileSlides = [
  {
    id: "fallback-m-1",
    image: "https://res.cloudinary.com/kd9q79hf/image/upload/v1721287950/sweet3.jpg",
    link: "/menu"
  },
  {
    id: "fallback-m-2",
    image: "https://res.cloudinary.com/kd9q79hf/image/upload/v1721287950/sweet1.jpg",
    link: "/menu"
  }
];

function Hero() {
  const [desktopSlides, setDesktopSlides] = useState([]);
  const [mobileSlides, setMobileSlides] = useState([]);
  const [currentDesktop, setCurrentDesktop] = useState(0);
  const [currentMobile, setCurrentMobile] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners");
        if (res.data?.success && res.data.banners?.length > 0) {
          const allBanners = res.data.banners;
          
          // Separate desktop vs mobile slides
          const dSlides = allBanners.filter(b => b.device !== "mobile");
          const mSlides = allBanners.filter(b => b.device === "mobile");

          setDesktopSlides(dSlides.length > 0 ? dSlides : fallbackDesktopSlides);
          setMobileSlides(mSlides.length > 0 ? mSlides : fallbackMobileSlides);
        } else {
          setDesktopSlides(fallbackDesktopSlides);
          setMobileSlides(fallbackMobileSlides);
        }
      } catch (err) {
        console.error("Failed to fetch banners, using fallbacks:", err);
        setDesktopSlides(fallbackDesktopSlides);
        setMobileSlides(fallbackMobileSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Autoplay functionality for Desktop
  useEffect(() => {
    if (desktopSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDesktop((prev) => (prev + 1) % desktopSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [desktopSlides]);

  // Autoplay functionality for Mobile
  useEffect(() => {
    if (mobileSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMobile((prev) => (prev + 1) % mobileSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [mobileSlides]);

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] min-h-[300px] md:min-h-[450px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 font-semibold animate-pulse">Loading hero slideshow...</div>
      </div>
    );
  }

  const activeDesktopSlide = desktopSlides[currentDesktop];
  const activeMobileSlide = mobileSlides[currentMobile];

  return (
    <div className="w-full bg-[#FDFCFA] font-sans">
      
      {/* 💻 LAPTOP/DESKTOP SLIDER VIEW (hidden on mobile, visible on md and up) */}
      <section className="hidden md:block w-full py-4 md:py-6 px-4 md:px-8 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div 
            onClick={() => activeDesktopSlide?.link && navigate(activeDesktopSlide.link)}
            className={`w-full relative aspect-[2.6/1] bg-gray-50 select-none overflow-hidden rounded-3xl shadow-sm ${
              activeDesktopSlide?.link ? "cursor-pointer" : ""
            }`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={activeDesktopSlide.id || activeDesktopSlide._id || currentDesktop}
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeDesktopSlide.image}
                  alt={activeDesktopSlide.title || "Banner"}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>

            {/* Desktop Navigation Controls */}
            {desktopSlides.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentDesktop((prev) => (prev === 0 ? desktopSlides.length - 1 : prev - 1));
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition border-none shadow-md backdrop-blur-sm z-30"
                  aria-label="Previous Desktop Slide"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentDesktop((prev) => (prev + 1) % desktopSlides.length);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition border-none shadow-md backdrop-blur-sm z-30"
                  aria-label="Next Desktop Slide"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Desktop Dots Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
                  {desktopSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentDesktop(idx);
                      }}
                      className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 border-none ${
                        currentDesktop === idx ? "bg-[#ff9248] scale-125 shadow-md" : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 📱 MOBILE/PHONE SLIDER VIEW (visible on mobile, hidden on md and up) */}
      <section className="block md:hidden w-full py-1 px-1">
        <div className="w-full">
          <div 
            onClick={() => activeMobileSlide?.link && navigate(activeMobileSlide.link)}
            className={`w-full relative aspect-[16/11.3] bg-gray-50 select-none overflow-hidden rounded-2xl shadow-sm ${
              activeMobileSlide?.link ? "cursor-pointer" : ""
            }`}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={activeMobileSlide.id || activeMobileSlide._id || currentMobile}
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeMobileSlide.image}
                  alt={activeMobileSlide.title || "Banner"}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation Controls */}
            {mobileSlides.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMobile((prev) => (prev === 0 ? mobileSlides.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition border-none shadow-md backdrop-blur-sm z-30"
                  aria-label="Previous Mobile Slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMobile((prev) => (prev + 1) % mobileSlides.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer transition border-none shadow-md backdrop-blur-sm z-30"
                  aria-label="Next Mobile Slide"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Mobile Dots Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
                  {mobileSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMobile(idx);
                      }}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 border-none ${
                        currentMobile === idx ? "bg-[#ff9248] scale-125 shadow-md" : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Hero;