import React, { useState } from "react";
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedSweets from "../../components/home/FeaturedSweets";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Stats from "../../components/home/Stats";
import GalleryPreview from "../../components/home/GalleryPreview";
import Testimonials from "../../components/home/Testimonials";
import KalakandHistory from "../../components/home/KalakandHistory";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaTimes } from "react-icons/fa";

function Home() {
  const { settings } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  const showNotification = 
    settings?.homeNotificationEnabled && 
    settings?.homeNotificationText && 
    !dismissed;

  return (
    <>
      <Hero />
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -15 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-[#FAF5EF] border-b border-gray-150 relative overflow-hidden font-sans"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#ff9248]/5 to-transparent pointer-events-none" />
            
            <div className="max-w-[1200px] mx-auto px-4 py-4 sm:py-5 flex items-center justify-between gap-4 relative z-10">
              
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Flashing Bell Icon Wrapper */}
                <div className="relative shrink-0 flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-orange-100 text-[#ff9248]">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-orange-150 opacity-40"
                  />
                  <FaBell className="text-sm sm:text-base animate-bounce" />
                </div>

                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffefb3] px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#013e37] uppercase tracking-wide mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff9248] animate-pulse" />
                    Important Announcement
                  </span>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-bold leading-relaxed pr-2">
                    {settings.homeNotificationText}
                  </p>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => setDismissed(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100/80 active:scale-95 text-gray-400 hover:text-gray-600 flex items-center justify-center border-none bg-transparent cursor-pointer transition-all shrink-0"
                aria-label="Dismiss announcement"
              >
                <FaTimes className="text-xs sm:text-sm" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Categories />

      <FeaturedSweets />

      <WhyChooseUs />

      <Stats />
      <GalleryPreview />

      <Testimonials />

      <KalakandHistory />
    </>
  );
}

export default Home;