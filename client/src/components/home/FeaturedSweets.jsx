import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

import Sweet1 from "../../assets/images/sweet1.jpg";
import Sweet2 from "../../assets/images/sweet2.jpg";
import Sweet3 from "../../assets/images/sweet3.jpg";
import Sweet4 from "../../assets/images/sweet4.jpg";

const sweets = [
  {
    id: 1,
    name: "Kaju Katli",
    image: Sweet1,
    price: 780,
    oldPrice: 850,
    rating: 4.9,
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Rasgulla",
    image: Sweet2,
    price: 320,
    oldPrice: 360,
    rating: 4.8,
    tag: "Fresh",
  },
  {
    id: 3,
    name: "Kalakand",
    image: Sweet3,
    price: 480,
    oldPrice: 520,
    rating: 5.0,
    tag: "Special",
  },
  {
    id: 4,
    name: "Gulab Jamun",
    image: Sweet4,
    price: 340,
    oldPrice: 390,
    rating: 4.9,
    tag: "Popular",
  },
];

function FeaturedSweets() {
  const { settings } = useAuth();

  return (
    <section className="py-24 bg-[var(--bg-section)]">
      <div className="section">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">
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
        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {sweets.map((item, index) => (
            <motion.div
              key={item.id}
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
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-[#ff9248] px-4 py-2 text-sm font-semibold text-white">
                  {item.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[#013e37]">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1">
                      <Star
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-semibold">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#ff9248]">
                      ₹{item.price}
                    </span>
                    <span className="text-slate-400 line-through">
                      ₹{item.oldPrice}
                    </span>
                  </div>
                </div>

                {settings?.orderingEnabled && (
                  <button
                    onClick={() => {
                      toast.success(`Added ${item.name} to cart!`);
                    }}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#ff9248] hover:bg-[#ea5a00] py-3 font-semibold text-white transition hover:scale-[1.02] cursor-pointer shadow-sm"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-16 text-center">
          <Link
            to="/menu"
            className="inline-block rounded-full border-2 border-[#013e37] px-8 py-4 font-semibold text-[#013e37] transition hover:bg-[#013e37] hover:text-white cursor-pointer"
          >
            View Complete Sweet Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedSweets;