import React from "react";
import { Award, CalendarDays, Users } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Award,
    value: "25+",
    title: "Years of Excellence",
    subtitle: "Serving happiness since 1998",
    iconBg: "bg-orange-50",
    iconColor: "text-[#ff9248]"
  },
  {
    icon: CalendarDays,
    value: "100+",
    title: "Delicious Dishes",
    subtitle: "Wide range of sweets & meals",
    iconBg: "bg-orange-50",
    iconColor: "text-[#ff9248]"
  },
  {
    icon: Users,
    value: "10K+",
    title: "Happy Customers",
    subtitle: "Trusted by thousands of families",
    iconBg: "bg-orange-50",
    iconColor: "text-[#013e37]"
  }
];

function StatsBanner() {
  return (
    <section className="py-6 px-4 bg-[#FDFCFA] font-sans">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-5 pb-6 md:pb-0 pt-6 md:pt-0 ${
                  idx === 0 ? "pt-0" : ""
                } ${
                  idx === stats.length - 1 ? "pb-0" : ""
                } md:px-6 lg:px-8`}
              >
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                {/* Content */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#013e37] leading-none">
                    {stat.value}
                  </h3>
                  <h4 className="text-sm sm:text-base font-bold text-gray-800 mt-1.5 leading-tight">
                    {stat.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default StatsBanner;
