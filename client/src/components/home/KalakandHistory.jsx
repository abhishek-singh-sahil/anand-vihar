import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Landmark, Sparkles, ChefHat, HeartHandshake, History } from "lucide-react";

const historyPoints = [
  {
    step: 1,
    year: "1998",
    title: "The Genesis",
    desc: "Anand Vihar Sweet Shop opens in Jhumri Telaiya, introducing a pure milk and cardamom recipe.",
    icon: ChefHat,
    color: "#ff9248",
  },
  {
    step: 2,
    year: "2005",
    title: "Master Craftsmanship",
    desc: "Artisans perfect slow-cooked milk reduction, adding saffron for a golden texture.",
    icon: Sparkles,
    color: "#013e37",
  },
  {
    step: 3,
    year: "2012",
    title: "Local Legend",
    desc: "Kesaria Kalakand gains a massive cult following, becoming Jhumri Telaiya's signature dessert choice.",
    icon: History,
    color: "#9a0002",
  },
  {
    step: 4,
    year: "2020",
    title: "Sweet Legacy",
    desc: "Serving generations of happy families, travelers, and corporate occasions across Koderma district.",
    icon: HeartHandshake,
    color: "#ff9248",
  },
  {
    step: 5,
    year: "Today",
    title: "GI Tag Honor",
    desc: "Kesaria Kalakand is officially certified as the Geographical Indication (GI) of Jhumri Telaiya, Jharkhand!",
    icon: Award,
    color: "#d4af37",
  },
];

function KalakandHistory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 bg-[#FAF5EF] relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#ff9248]/5 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#013e37]/5 blur-[120px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ff9248]/10 px-4 py-1.5 text-[#ff9248] text-xs font-bold uppercase tracking-wider mb-4">
            <Landmark size={13} />
            <span>Culinary Heritage</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#013e37] tracking-tight">
            Story of <span className="text-[#ff9248]">Kesaria Kalakand</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            Follow the 5-pointed journey of Jhumri Telaiya's legendary sweet, handcrafted to perfection daily by Anand Vihar Sweet Shop.
          </p>
        </div>

        {/* TIMELINE INTERACTIVE CONTAINER */}
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-premium relative overflow-hidden mb-12">
          
          {/* Timeline Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[92px] left-[10%] right-[10%] h-1 bg-gray-100 z-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff9248] via-[#013e37] to-[#d4af37]"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>

          {/* Steps Horizontal Stack */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0 items-center justify-between text-center">
            {historyPoints.map((point, index) => {
              const Icon = point.icon;
              const isActive = activeStep === index;
              return (
                <div key={point.step} className="flex flex-col items-center group">
                  {/* Step Selector Circle */}
                  <button
                    onClick={() => setActiveStep(index)}
                    className="relative focus:outline-none cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        borderColor: isActive ? point.color : "#e2e8f0",
                        backgroundColor: isActive ? "#ffffff" : "#ffffff",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`h-16 w-16 rounded-full border-4 flex items-center justify-center shadow-md relative z-10`}
                    >
                      <Icon 
                        size={22} 
                        style={{ color: isActive ? point.color : "#94a3b8" }}
                        className="transition-colors duration-300"
                      />
                    </motion.div>

                    {/* Step Number Badge */}
                    <span className="absolute -top-2 -right-2 bg-slate-800 text-white font-bold text-[10px] h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow">
                      {point.step}
                    </span>
                  </button>

                  {/* Year text */}
                  <span className={`mt-4 text-lg font-bold transition-colors duration-300 ${isActive ? "text-[#013e37]" : "text-gray-400"}`}>
                    {point.year}
                  </span>

                  {/* Short title */}
                  <span className={`mt-1 text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ${isActive ? "text-[#ff9248]" : "text-gray-400"}`}>
                    {point.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Detail Box */}
          <div className="mt-12 pt-8 border-t border-gray-100 min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-2xl mx-auto"
              >
                <h3 className="text-2xl font-bold text-[#013e37]" style={{ color: historyPoints[activeStep].color }}>
                  {historyPoints[activeStep].year} — {historyPoints[activeStep].title}
                </h3>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium px-4">
                  "{historyPoints[activeStep].desc}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* GEOGRAPHICAL INDICATION (GI) SPECIAL HONORS BANNER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#013e37] to-[#045148] p-8 md:p-12 text-center text-white shadow-xl"
        >
          {/* Glowing Background FX */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,146,72,0.15),transparent_60%)]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#ff9248] mb-6">
              <Award size={36} className="text-yellow-400" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Official Geographical Indication (GI) Certified
            </h3>
            
            <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-slate-100 max-w-3xl">
              Today, Kesaria Kalakand stands proud as the official **Geographical Indication (GI) of Jhumri Telaiya, Jharkhand**. Every bite crafted at **Anand Vihar Sweet Shop** preserves this native culinary identity, bringing authentic regional excellence to sweet lovers worldwide.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default KalakandHistory;
