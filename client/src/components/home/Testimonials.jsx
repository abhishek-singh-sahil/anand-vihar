import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import api from "../../services/api";

import Customer1 from "../../assets/images/customer1.jpg";
import Customer2 from "../../assets/images/customer2.jpg";
import Customer3 from "../../assets/images/customer3.jpg";

const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Rahul Kumar",
    city: "a week ago",
    rating: 5,
    review: "The sweets are incredibly fresh and the restaurant food is absolutely delicious. Their hospitality is outstanding. Highly recommended!",
    profilePic: Customer1,
  },
  {
    id: "fallback-2",
    name: "Priya Sharma",
    city: "2 weeks ago",
    rating: 5,
    review: "One of the best sweet shops in Jhumri Telaiya. The taste, cleanliness, and service make every festive occasion memorable.",
    profilePic: Customer2,
  },
  {
    id: "fallback-3",
    name: "Amit Singh",
    city: "3 weeks ago",
    rating: 5,
    review: "Excellent quality, pure ingredients, and a wonderful family atmosphere. Their signature Kalakand is my absolute favorite.",
    profilePic: Customer3,
  },
];

function Testimonials() {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/testimonials/approved");
        if (res.data.success) {
          if (res.data.testimonials && res.data.testimonials.length > 0) {
            setItems(res.data.testimonials);
          } else {
            setItems([]);
          }
          setSettings(res.data.settings || null);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (!loading && (!settings || !settings.enabled || items.length === 0)) {
    return null;
  }

  const showPhoto = settings ? settings.showPhoto : true;
  const showDate = settings ? settings.showDate : true;
  const showRating = settings ? settings.showRating : true;

  return (
    <section className="py-8 md:py-12 bg-[#FAF5EF] relative overflow-hidden font-sans border-t border-gray-100">
      {/* Background Orbs */}
      <div className="absolute -top-40 right-0 h-[350px] w-[350px] rounded-full bg-[#013e37]/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-[#ff9248]/5 blur-[100px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-10"
        >
          <span className="inline-flex items-center rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37] text-xs sm:text-sm uppercase tracking-wider mb-4">
            Google Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#013e37] tracking-tight">
            What Our Customers Say on Google
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            The love and trust of our customers inspire us every day to serve pure sweets and authentic delicacies.
          </p>
        </motion.div>

        {/* Google Rating Summary Banner */}
        {settings && settings.enabled && settings.showOverallRating && (
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="bg-white px-6 py-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-center gap-3">
              <span className="font-extrabold text-[#013e37] text-sm sm:text-base">Google Rating</span>
              <div className="flex text-yellow-400">
                {Array.from({ length: Math.round(settings.averageRating || 5) }).map((_, i) => (
                  <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">
                {settings.averageRating ? settings.averageRating.toFixed(1) : "5.0"} / 5.0
              </span>
              {settings.showTotalReviews && (
                <span className="text-xs font-semibold text-gray-400">
                  ({settings.totalReviews || "50+"} reviews)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Testimonials Cards Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const hasAvatar = item.profilePic || (item.images && item.images.length > 0);
            const avatarUrl = item.profilePic || (item.images && item.images[0]);
            
            return (
              <motion.div
                key={item.id || item._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm hover:shadow-md border border-gray-50 flex flex-col justify-between transition-all duration-300 min-h-[260px]"
              >
                <div>
                  {/* Card Header: Profile Info & Rating */}
                  <div className="flex items-center gap-4">
                    {showPhoto ? (
                      hasAvatar ? (
                        <img
                          src={avatarUrl}
                          alt={item.name}
                          className="h-14 w-14 rounded-full object-cover border border-gray-100 shrink-0"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-[#FFF4EB] border border-[#ff9248] flex items-center justify-center font-bold text-lg text-[#ff9248] shrink-0">
                          {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )
                    ) : null}

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm sm:text-base text-[#013e37] leading-tight truncate">
                        {item.name}
                      </h4>
                      {showDate && (
                        <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-1">
                          {item.city || "Google Reviewer"}
                        </p>
                      )}
                    </div>

                    {showRating && (
                      <div className="ml-auto flex text-yellow-400 shrink-0">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="mt-5 text-xs sm:text-sm text-slate-600 leading-relaxed italic font-medium font-sans">
                    "{item.review || "Excellent sweets and top-tier customer service!"}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-50 text-[10px] sm:text-xs text-gray-400 flex justify-between items-center">
                  <span className="flex items-center gap-1 font-semibold text-gray-500">
                    <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
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

        {/* Dynamic Action Buttons */}
        {settings && (settings.enableWriteBtn || settings.enableViewAllBtn) && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {settings.enableWriteBtn && settings.reviewUrl && (
              <a
                href={settings.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm no-underline text-center cursor-pointer"
              >
                Write a Google Review
              </a>
            )}
            {settings.enableViewAllBtn && (settings.mapUrl || settings.reviewUrl) && (
              <a
                href={settings.mapUrl || settings.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[#013e37] text-[#013e37] hover:bg-gray-55 active:scale-95 font-bold rounded-xl shadow-sm transition-all text-sm no-underline text-center cursor-pointer"
              >
                View All Reviews on Google
              </a>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export default Testimonials;