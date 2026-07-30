import React from "react";
import { motion } from "framer-motion";
import Gallery1 from "../../assets/images/gallery1.jpg";
import Gallery2 from "../../assets/images/gallery2.jpg";
import Gallery3 from "../../assets/images/gallery3.jpg";
import {
  Award,
  HeartHandshake,
  ChefHat,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AboutImage from "../../assets/images/about.jpg";

function About() {
  const { settings } = useAuth();

  return (
    <main className="bg-[#FDFCFA] font-sans overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#FAF5EF] py-12 md:py-20 px-4 sm:px-6">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#ff9248]/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[#013e37]/10 blur-[150px]" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff9248]/10 text-[#ff9248] text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={12} />
                <span>About Anand Vihar</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[#013e37] tracking-tight">
                Crafting
                <span className="text-[#ff9248]"> Sweet Memories</span>
                <br />
                Since 1998
              </h1>

              <p className="mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 max-w-xl">
                Anand Vihar has been Jhumri Telaiya's benchmark for authentic Indian sweets, pure ghee delicacies, and traditional confectionery craftsmanship for over two decades. Every recipe carries the pure flavor of tradition blended with uncompromising quality standards.
              </p>

              <div className="mt-8">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-3 rounded-full bg-[#ff9248] hover:bg-[#ea5a00] px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer no-underline"
                >
                  Explore Sweets Menu
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full"
            >
              <div className="absolute inset-0 rounded-[32px] bg-[#ff9248]/10 blur-2xl"></div>
              <div className="relative rounded-[32px] overflow-hidden border border-gray-100 shadow-xl h-[300px] sm:h-[400px] lg:h-[450px]">
                <img
                  src={AboutImage}
                  alt="About Anand Vihar"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#013e37]/5 text-[#013e37] text-xs font-bold uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013e37] leading-tight">
                A Journey Built on Purity, Trust & Tradition
              </h2>

              <p className="mt-6 text-sm sm:text-base text-slate-600 leading-relaxed">
                What began as a dedicated endeavor to revive authentic regional Indian sweets has today grown into Jhumri Telaiya’s most trusted destination for pure ghee sweets, festive dry fruits, and gourmet confectioneries. Our commitment has always been simple — pure ingredients, local heritage, and heartfelt service.
              </p>

              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                Every customer who walks into Anand Vihar Sweet Shop becomes part of our extended family. From weddings, baby showers, and regional festivals to daily sweet cravings — we take absolute pride in making your life's milestones sweeter.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <Award className="mb-4 text-[#ff9248]" size={36} />
                <h3 className="text-xl font-bold text-[#013e37]">Premium Ingredients</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We use only high-grade saffron, rich dry fruits, organic cardamom, and pure milk fats sourced from trusted dairy partners to maintain premium consistency.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <HeartHandshake className="mb-4 text-[#013e37]" size={36} />
                <h3 className="text-xl font-bold text-[#013e37]">Generations of Trust</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Decades of uncompromised taste have earned us a special place in the hearts of thousands of families across Jhumri Telaiya and Koderma.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="bg-[#FAF5EF] py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff9248]/10 text-[#ff9248] text-xs font-bold uppercase tracking-wider mb-4">
              Our Purpose
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013e37]">Mission & Vision</h2>
            <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              Every sweet we craft and every customer interaction is guided by our values of pure hygiene, authentic taste, and traditional heritage.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF4EB]">
                  <ChefHat size={28} className="text-[#ff9248]" />
                </div>
                <h3 className="text-2xl font-bold text-[#013e37]">Our Mission</h3>
                <p className="mt-4 text-slate-500 leading-relaxed text-xs sm:text-sm">
                  To handcraft authentic Indian sweets using time-honored techniques, ensuring complete visual and physical quality checks. We aim to protect regional recipes and offer clean, wholesome treats that bring families together.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF8F4]">
                  <Sparkles size={28} className="text-[#013e37]" />
                </div>
                <h3 className="text-2xl font-bold text-[#013e37]">Our Vision</h3>
                <p className="mt-4 text-slate-500 leading-relaxed text-xs sm:text-sm">
                  To expand our sweetcraft heritage globally as Jhumri Telaiya's premier confectionery brand, adopting modern packaging systems while preserving traditional handmade flavor standards.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#013e37]/5 text-[#013e37] text-xs font-bold uppercase tracking-wider mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013e37]">
              Experience The Anand Vihar Difference
            </h2>
          </div>

          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "25+",
                title: "Years of Heritage",
                desc: "Serving happiness since 1998.",
              },
              {
                number: "80+",
                title: "Sweets & Desserts",
                desc: "Wide range of classic & fusion sweets.",
              },
              {
                number: "10K+",
                title: "Happy Families",
                desc: "Trusted across generations.",
              },
              {
                number: "100%",
                title: "Pure & Hygienic",
                desc: "Made daily in safe, sterile kitchens.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="bg-white text-center p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#ff9248]">{item.number}</h3>
                <h4 className="mt-3 text-base sm:text-lg font-bold text-[#013e37] leading-snug">{item.title}</h4>
                <p className="mt-2 text-xxs sm:text-xs text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMPANY TIMELINE ================= */}
      <section className="bg-[#FAF5EF] py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ff9248]/10 text-[#ff9248] text-xs font-bold uppercase tracking-wider mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013e37]">Milestones Through The Years</h2>
          </div>

          {/* Narrower container to remove empty/vacant look on laptop, centered beautifully */}
          <div className="max-w-2xl mx-auto space-y-6 relative">
            {/* Subtle timeline connector bar */}
            <div className="absolute left-6 sm:left-14 top-4 bottom-4 w-0.5 bg-[#013e37]/10 z-0"></div>

            {[
              {
                year: "1998",
                title: "Confectionery Shop Founded",
                desc: "Opened our doors near Jhanda Chowk with a focused catalog of core milk and ghee sweets.",
              },
              {
                year: "2010",
                title: "Kitchen Expansion & Modernization",
                desc: "Adopted specialized temperature-controlled sweet crafting chambers and milk boilers to support bulk orders.",
              },
              {
                year: "2018",
                title: "Trusted Regional Sweet Brand",
                desc: "Recognized as the primary sweet caterer for festivals, corporate events, and wedding functions in Koderma district.",
              },
              {
                year: "2026",
                title: "Digital Sweet Store",
                desc: "Launching our dynamic web catalog to showcase fresh sweet stocks, blogs, and testimonials.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="bg-white flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm relative z-10 items-start hover:shadow-md transition"
              >
                <div className="rounded-xl bg-[#013e37] text-white font-bold text-sm sm:text-base py-1.5 px-3 sm:px-4 text-center shrink-0 min-w-[55px] sm:min-w-[70px]">
                  {item.year}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#013e37] leading-tight">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY PREVIEW ================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#013e37]/5 text-[#013e37] text-xs font-bold uppercase tracking-wider mb-4">
              Confectionery Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013e37]">A Glimpse of Anand Vihar</h2>
            <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              Every detail reflects our passion for pure sweets, premium aesthetics, and welcoming service.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[Gallery1, Gallery2, Gallery3].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="group overflow-hidden rounded-[24px] shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-[250px] sm:h-[300px] md:h-[340px] w-full overflow-hidden">
                  <img
                    src={image}
                    alt="Sweet Shop Gallery"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-[32px] bg-gradient-to-r from-[#013e37] to-[#045148] px-6 py-12 text-center text-white shadow-xl sm:px-12 md:px-16"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-1.5 text-xs select-none">
              Anand Vihar Sweet Shop
            </span>

            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Experience Pure Sweetness Today
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-white/80">
              Whether you are ordering custom gift boxes for a wedding, celebrating a festival, or enjoying your favorite daily sweets, Anand Vihar promises pure ingredients and unforgettable traditional taste.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/contact"
                className="rounded-full border-2 border-white hover:bg-white hover:text-[#013e37] px-8 py-3.5 text-sm sm:text-base font-bold transition transform hover:scale-105 text-white cursor-pointer no-underline min-w-[140px]"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}

export default About;