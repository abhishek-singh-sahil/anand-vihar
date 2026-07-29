import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, ChefHat, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Expert Chefs",
    description: "Our experienced chefs prepare every dish with authentic recipes and fresh ingredients.",
    iconBg: "bg-orange-50",
    iconColor: "text-[#ff9248]"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest ingredients are selected to ensure rich taste and consistent quality.",
    iconBg: "bg-orange-50",
    iconColor: "text-[#ff9248]"
  },
  {
    icon: ShieldCheck,
    title: "100% Hygienic",
    description: "Prepared in a clean, hygienic kitchen following high food safety standards.",
    iconBg: "bg-orange-50",
    iconColor: "text-[#013e37]"
  },
  {
    icon: Truck,
    title: "Quick Service",
    description: "Fast preparation and timely delivery so you enjoy every meal fresh.",
    iconBg: "bg-orange-50",
    iconColor: "text-[#ff9248]"
  }
];

function WhyChooseUs() {
  return (
    <section className="py-12 bg-[#FDFCFA] overflow-hidden font-sans">
      <div className="section">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <span className="inline-block rounded-full bg-[#ffefb3] px-4 py-1.5 font-bold text-xs uppercase tracking-wider text-[#013e37] mb-4">
              Why Choose Us
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#013e37] leading-tight tracking-tight">
              Taste You Can Trust,
              <br />
              <span className="text-[#ff9248]">Quality You Can Feel</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
              Anand Vihar has been serving customers with authentic sweets and delicious restaurant dishes for years. Every recipe reflects quality, freshness and the traditional taste that keeps customers coming back.
            </p>

            <Link 
              to="/about"
              className="mt-6 inline-block bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 text-white font-bold text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg transition cursor-pointer text-center"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Right Features Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mt-8 lg:mt-0">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mb-4 ${item.iconBg}`}>
                    <Icon className={`w-5.5 h-5.5 ${item.iconColor}`} size={22} />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#013e37]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;