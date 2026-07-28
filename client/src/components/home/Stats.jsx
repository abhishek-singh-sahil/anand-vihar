import { motion } from "framer-motion";
import {
  Users,
  UtensilsCrossed,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "10K+",
    title: "Happy Customers",
    description: "Customers who trust our quality and service.",
    color: "#ff9248",
  },
  {
    icon: UtensilsCrossed,
    number: "150+",
    title: "Premium Sweet Items",
    description: "A wide variety of delicious traditional sweets.",
    color: "#013e37",
  },
  {
    icon: BadgeCheck,
    number: "25+",
    title: "Years Experience",
    description: "Serving authentic taste with consistent quality.",
    color: "#9a0002",
  },
  {
    icon: HeartHandshake,
    number: "99%",
    title: "Customer Satisfaction",
    description: "Built on trust, freshness and unforgettable taste.",
    color: "#ff9248",
  },
];

function Stats() {
  return (
    <section className="py-24 relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 green-gradient"></div>

      <div className="absolute -top-40 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#ff9248]/10 blur-3xl"></div>

      <div className="section relative z-10">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">
            Our Achievements
          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-white">
            Numbers That Speak
          </h2>

          <p className="mt-6 text-white/80 leading-8">
            Years of dedication, thousands of satisfied customers,
            and an ever-growing collection of delicious traditional sweets.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.12,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                }}
                className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 text-center"
              >

                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <Icon
                    size={36}
                    color="white"
                  />
                </div>

                <h2 className="mt-8 text-5xl font-bold text-white">

                  {item.number}

                </h2>

                <h3 className="mt-4 text-2xl font-semibold text-[#ffefb3]">

                  {item.title}

                </h3>

                <p className="mt-5 leading-7 text-white/75">

                  {item.description}

                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}

export default Stats;