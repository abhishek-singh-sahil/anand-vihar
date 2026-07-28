import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
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

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await api.get("/menu/items");
        if (res.data?.success) {
          // Prioritize Bestsellers and Popular items
          let items = res.data.items || [];
          const best = items.filter(x => x.bestseller || x.popular);
          const finalItems = best.length >= 4 ? best.slice(0, 4) : items.slice(0, 4);
          setSweets(finalItems);
        }
      } catch (err) {
        console.error("Failed to fetch featured sweets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  return (
    <section className="py-24 bg-[var(--bg-section)] font-sans">
      <div className="section">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37] text-sm">
            Signature Sweets
          </span>

          <h2 className="mt-6 text-4xl font-bold text-[#013e37] lg:text-5xl">
            Our Most Loved Sweets
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            Freshly prepared every day using premium ingredients and
            traditional recipes that have delighted generations.
          </p>
        </motion.div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-semibold">
            Loading signature sweets...
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-semibold">
            No sweets available at the moment.
          </div>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {sweets.map((item, index) => {
              const hasDiscount = item.discount > 0;
              const displayPrice = item.price;
              const originalPrice = hasDiscount ? Math.round(item.price / (1 - item.discount / 100)) : null;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -10 }}
                  className="group overflow-hidden rounded-3xl bg-white shadow-premium flex flex-col justify-between"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    {/* Tag Badge */}
                    <span className="absolute left-4 top-4 rounded-full bg-[#ff9248] px-4 py-1.5 text-xs font-bold uppercase text-white shadow-sm">
                      {item.bestseller ? "Bestseller" : item.popular ? "Popular" : "Fresh"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#013e37] group-hover:text-[#ff9248] transition leading-tight">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-1 shrink-0">
                          <Star
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="font-bold text-sm text-gray-700">4.9</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-extrabold text-[#ff9248]">
                          ₹{displayPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-slate-400 line-through text-sm font-semibold">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {settings?.orderingEnabled && (
                      <button
                        onClick={async () => {
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
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 py-3.5 font-bold text-white transition hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg border-none"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-full border-2 border-[#013e37] px-8 py-4 font-bold text-[#013e37] transition hover:bg-[#013e37] hover:text-white cursor-pointer shadow-sm"
          >
            View Complete Sweet Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedSweets;