import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import api from "../../services/api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials/approved");
      if (response.data.success) {
        setTestimonials(response.data.testimonials || []);
        setSettings(response.data.settings || null);
      }
    } catch (error) {
      console.error("Could not fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FDFCFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff9248]"></div>
      </div>
    );
  }

  // If globally disabled
  if (settings && !settings.enabled) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FDFCFA] py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-700">Reviews Section Disabled</h2>
        <p className="text-gray-500 mt-2 text-center">We currently do not have reviews visible on our page. Please check back later!</p>
      </div>
    );
  }

  const showPhoto = settings ? settings.showPhoto : true;
  const showDate = settings ? settings.showDate : true;
  const showRating = settings ? settings.showRating : true;

  return (
    <div className="min-h-screen bg-[#FDFCFA] pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-[#013e37] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#ff9248]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px] pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Customer Reviews</h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Read real reviews from our customers synced directly from Google Business Profile. We take pride in delivering top-quality sweets and services.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-12">
        {/* Google Rating Summary Card */}
        {settings && settings.showOverallRating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-[#013e37]">Google Rating Summary</h2>
              <p className="text-sm text-gray-500 mt-1">Verified reviews directly from our Google business page</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-black text-[#013e37] block">
                  {settings.averageRating ? settings.averageRating.toFixed(1) : "5.0"}
                </span>
                <div className="flex text-yellow-400 justify-center mt-1">
                  {Array.from({ length: Math.round(settings.averageRating || 5) }).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-400 mt-1 block">
                  Out of 5 Stars
                </span>
              </div>

              {settings.showTotalReviews && (
                <>
                  <div className="w-[1px] h-12 bg-gray-100 hidden sm:block" />

                  <div className="text-center sm:text-left">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#013e37] block">
                      {settings.totalReviews || "50+"}
                    </span>
                    <span className="text-xs font-bold text-gray-400 block mt-1">
                      Total Google Reviews
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {settings.enableWriteBtn && settings.reviewUrl && (
                <a
                  href={settings.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm no-underline shadow-sm transition-all cursor-pointer"
                >
                  Write a Review
                </a>
              )}
              {settings.enableViewAllBtn && (settings.mapUrl || settings.reviewUrl) && (
                <a
                  href={settings.mapUrl || settings.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 border border-[#013e37] text-[#013e37] hover:bg-gray-55 active:scale-95 font-bold rounded-xl text-xs sm:text-sm no-underline transition-all cursor-pointer"
                >
                  View on Google
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Reviews Grid */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">No cached reviews found. Check back later after a scheduled sync!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => {
              const hasAvatar = item.profilePic || (item.images && item.images.length > 0);
              const avatarUrl = item.profilePic || (item.images && item.images[0]);
              
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md border border-gray-50 flex flex-col justify-between transition-all duration-200 min-h-[250px]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      {showPhoto ? (
                        hasAvatar ? (
                          <img
                            src={avatarUrl}
                            alt={item.name}
                            className="h-12 w-12 rounded-full object-cover border border-gray-100 shrink-0"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-[#FFF4EB] border border-[#ff9248] flex items-center justify-center font-bold text-base text-[#ff9248] shrink-0">
                            {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                          </div>
                        )
                      ) : null}

                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-[#013e37] leading-tight truncate">
                          {item.name}
                        </h3>
                        {showDate && (
                          <p className="text-[10px] sm:text-xs text-gray-400 font-semibold mt-1">
                            {item.city || "Google Reviewer"}
                          </p>
                        )}
                      </div>

                      {showRating && (
                        <div className="ml-auto flex text-yellow-400 shrink-0">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <p className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed italic font-medium font-sans">
                      "{item.review || "Excellent service and high quality products!"}"
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-50 text-[10px] sm:text-xs text-gray-400 flex justify-between items-center">
                    <span className="flex items-center gap-1 font-semibold text-gray-500">
                      <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.693 0-8.5-3.807-8.5-8.5s3.807-8.5 8.5-8.5c2.14 0 4.09.78 5.61 2.05L19.98 1.5C17.86-.33 15.12-1.35 12.24-1.35c-6.83 0-12.39 5.56-12.39 12.39S5.41 23.43 12.24 23.43c7.14 0 11.85-5.02 11.85-12.08 0-.81-.07-1.42-.23-2.07H12.24z"/>
                      </svg>
                      Google Review
                    </span>
                    {showDate && item.createdAt && (
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Testimonials;
