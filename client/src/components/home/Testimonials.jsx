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
    city: "Jhumri Telaiya",
    rating: 5,
    review: "The sweets are incredibly fresh and the restaurant food is absolutely delicious. Their hospitality is outstanding. Highly recommended!",
    images: [Customer1],
  },
  {
    id: "fallback-2",
    name: "Priya Sharma",
    city: "Jhumri Telaiya",
    rating: 5,
    review: "One of the best sweet shops in Jhumri Telaiya. The taste, cleanliness, and service make every festive occasion memorable.",
    images: [Customer2],
  },
  {
    id: "fallback-3",
    name: "Amit Singh",
    city: "Koderma",
    rating: 5,
    review: "Excellent quality, pure ingredients, and a wonderful family atmosphere. Their signature Kalakand is my absolute favorite.",
    images: [Customer3],
  },
];

function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/testimonials/approved");
        if (res.data.success && res.data.testimonials && res.data.testimonials.length > 0) {
          // Take first 3 approved testimonials
          setItems(res.data.testimonials.slice(0, 3));
        } else {
          setItems(fallbackTestimonials);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
        setItems(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#FAF5EF] relative overflow-hidden font-sans border-t border-gray-100">
      {/* Background Orbs */}
      <div className="absolute -top-40 right-0 h-[350px] w-[350px] rounded-full bg-[#013e37]/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-[#ff9248]/5 blur-[100px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37] text-xs sm:text-sm uppercase tracking-wider mb-4">
            Guest Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#013e37] tracking-tight">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
            The love and trust of our customers inspire us every day to serve pure sweets and authentic delicacies.
          </p>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const hasAvatar = item.images && item.images.length > 0;
            return (
              <motion.div
                key={item.id || item._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm hover:shadow-md border border-gray-50 flex flex-col justify-between transition-all duration-300 min-h-[280px]"
              >
                <div>
                  {/* Card Header: Profile Info & Rating */}
                  <div className="flex items-center gap-4">
                    {hasAvatar ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-[#ff9248] shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-[#FFF4EB] border-2 border-[#ff9248] flex items-center justify-center font-bold text-xl text-[#ff9248] shrink-0">
                        {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm sm:text-base text-[#013e37] leading-tight truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mt-1">
                        {item.city || "Jhumri Telaiya"}
                      </p>
                    </div>

                    <div className="ml-auto flex text-yellow-400">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="mt-6 text-xs sm:text-sm text-slate-600 leading-relaxed italic font-medium font-sans">
                    "{item.review}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 text-[10px] sm:text-xs text-gray-400 flex justify-between items-center">
                  <span>Verified Guest</span>
                  {item.createdAt && (
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;