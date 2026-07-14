import { motion } from "framer-motion";
import {
  Award,
  ChefHat,
  ShieldCheck,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Expert Chefs",
    description:
      "Our experienced chefs prepare every dish with authentic recipes and fresh ingredients.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Only the finest ingredients are selected to ensure rich taste and consistent quality.",
  },
  {
    icon: ShieldCheck,
    title: "100% Hygienic",
    description:
      "Prepared in a clean, hygienic kitchen following high food safety standards.",
  },
  {
    icon: Truck,
    title: "Quick Service",
    description:
      "Fast preparation and timely delivery so you enjoy every meal fresh.",
  },
];

function WhyChooseUs() {
  return (
    <section className="py-24 bg-[var(--bg-section)] overflow-hidden">

      <div className="section">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <span className="inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">
              Why Choose Us
            </span>

            <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[#013e37] leading-tight">
              Taste You Can Trust,
              <br />
              Quality You Can Feel
            </h2>

            <p className="mt-8 text-slate-600 leading-8">
              Anand Vihar has been serving customers with authentic
              sweets and delicious restaurant dishes for years.
              Every recipe reflects quality, freshness and the
              traditional taste that keeps customers coming back.
            </p>

            <button className="mt-10 orange-gradient rounded-full px-8 py-4 text-white font-semibold shadow-lg hover:scale-105 transition">
              Learn More
            </button>

          </motion.div>

          {/* Right */}

          <div className="grid sm:grid-cols-2 gap-6">

            {features.map((item, index) => {

              const Icon = item.icon;

              return (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.12,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -8,
                  }}
                  className="rounded-3xl bg-white p-8 shadow-premium"
                >

                  <div className="w-16 h-16 rounded-2xl bg-[#ff9248] flex items-center justify-center">

                    <Icon
                      color="white"
                      size={32}
                    />

                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-[#013e37]">

                    {item.title}

                  </h3>

                  <p className="mt-4 text-slate-600 leading-7">

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