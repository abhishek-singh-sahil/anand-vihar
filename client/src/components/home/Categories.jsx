import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Candy,
  Pizza,
  Coffee,
  IceCreamCone,
  Soup,
  Sandwich,
} from "lucide-react";

const categories = [
  {
    title: "Traditional Sweets",
    icon: Candy,
    color: "#ff9248",
    description: "Freshly prepared traditional Indian sweets.",
  },
  {
    title: "Fast Food",
    icon: Pizza,
    color: "#013e37",
    description: "Delicious burgers, pizzas and more.",
  },
  {
    title: "Beverages",
    icon: Coffee,
    color: "#9a0002",
    description: "Tea, coffee, shakes and cold drinks.",
  },
  {
    title: "Ice Cream",
    icon: IceCreamCone,
    color: "#ff9248",
    description: "Premium ice cream and desserts.",
  },
  {
    title: "Main Course",
    icon: Soup,
    color: "#013e37",
    description: "Complete lunch & dinner meals.",
  },
  {
    title: "Snacks",
    icon: Sandwich,
    color: "#9a0002",
    description: "Fresh snacks for every moment.",
  },
];

function Categories() {
  const { settings } = useAuth();

  // Show only 3 sweet-related cards if restaurant mode (reservations) is off
  const displayedCategories = (settings?.reservationsEnabled)
    ? categories
    : categories.filter(
        (c) =>
          c.title === "Traditional Sweets" ||
          c.title === "Beverages" ||
          c.title === "Ice Cream"
      );

  return (
    <section className="py-24 bg-[var(--bg-main)] font-sans">
      <div className="section">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block bg-[#ffefb3] text-[#013e37] px-5 py-2 rounded-full font-semibold">
            Our Categories
          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[#013e37]">
            Explore Our Delicious Collection
          </h2>

          <p className="mt-6 text-slate-600 leading-8">
            Whether you're craving authentic Indian sweets, refreshing beverages, or premium ice creams, Anand Vihar has something for everyone.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCategories.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                }}
                className="group rounded-3xl bg-[var(--bg-card)] p-8 shadow-premium border border-transparent hover:border-[#ff9248]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: item.color,
                    }}
                  >
                    <Icon
                      size={40}
                      color="white"
                    />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-[#013e37] group-hover:text-[#ff9248] transition">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>

                <Link
                  to="/menu"
                  className="mt-8 inline-block text-[#ff9248] font-semibold hover:text-[#ea5a00] transition cursor-pointer text-left"
                >
                  View Menu →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;