import { motion } from "framer-motion";
import { Clock3, Flame, Star } from "lucide-react";
import { Link } from "react-router-dom";

import Dish1 from "../../assets/images/dish1.jpg";
import Dish2 from "../../assets/images/dish2.jpg";
import Dish3 from "../../assets/images/dish3.jpg";
import Dish4 from "../../assets/images/dish4.jpg";

const dishes = [
  {
    id: 1,
    image: Dish1,
    name: "Special Veg Thali",
    price: 220,
    rating: 4.9,
    time: "20 Min",
    spicy: "Medium",
  },
  {
    id: 2,
    image: Dish2,
    name: "Paneer Butter Masala",
    price: 260,
    rating: 4.8,
    time: "18 Min",
    spicy: "Medium",
  },
  {
    id: 3,
    image: Dish3,
    name: "Veg Fried Rice",
    price: 180,
    rating: 4.7,
    time: "15 Min",
    spicy: "Low",
  },
  {
    id: 4,
    image: Dish4,
    name: "Masala Dosa",
    price: 140,
    rating: 4.9,
    time: "12 Min",
    spicy: "Low",
  },
];

function RestaurantSpecials() {
  return (
    <section className="py-24 bg-[var(--bg-main)]">
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div>
            <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">
              Restaurant Special
            </span>

            <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-[#013e37]">
              Chef's Recommended Dishes
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              Freshly prepared meals using quality ingredients,
              authentic recipes and unforgettable flavours.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-block rounded-full bg-[#ff9248] hover:bg-[#ea5a00] px-7 py-4 text-white font-semibold shadow-lg hover:scale-105 transition duration-300 text-center cursor-pointer"
          >
            View Full Restaurant Menu
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
              }}
              className="overflow-hidden rounded-[28px] bg-white shadow-premium flex flex-col justify-between"
            >
              <div className="relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-64 w-full object-cover transition duration-500 hover:scale-110"
                />

                <div className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 flex items-center gap-2 shadow-lg">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="font-semibold">
                    {dish.rating}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#013e37] leading-tight">
                    {dish.name}
                  </h3>

                  <div className="mt-5 flex justify-between">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                      <Clock3 size={16} />
                      {dish.time}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
                      <Flame size={16} />
                      {dish.spicy}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-50">
                  <h2 className="text-2xl font-extrabold text-[#ff9248]">
                    ₹{dish.price}
                  </h2>
                  
                  {/* Styled Shop tag instead of Order Now button */}
                  <span className="text-[10px] font-bold text-[#013e37] bg-[#fff4eb] px-3.5 py-2 rounded-xl uppercase tracking-wider select-none border border-[#ff9248]/10 shadow-sm">
                    Shop Dine-In
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RestaurantSpecials;