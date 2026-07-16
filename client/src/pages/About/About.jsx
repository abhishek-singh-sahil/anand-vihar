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
    <main className="bg-[#FDFCFA] font-sans">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#FAF5EF]">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#ff9248]/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[#013e37]/10 blur-[150px]" />

        <div className="section">
          <div className="grid items-center gap-16 py-24 lg:grid-cols-2">
            
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="badge">
                <Sparkles size={16} />
                About Anand Vihar
              </div>

              <h1 className="mt-8 text-5xl font-extrabold leading-tight text-[#013e37] md:text-6xl">
                Crafting
                <span className="text-[#ff9248]"> Sweet Memories</span>
                <br />
                Since 1998
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-9 text-slate-600">
                Anand Vihar has been Jhumri Telaiya's benchmark for authentic Indian sweets, pure ghee delicacies, and traditional confectionery craftsmanship for over two decades. Every recipe carries the pure flavor of tradition blended with uncompromising quality standards.
              </p>

              <Link
                to="/menu"
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#ff9248] hover:bg-[#ea5a00] px-8 py-4 text-lg font-semibold text-white shadow-premium hover-up cursor-pointer"
              >
                Explore Sweets Menu
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[40px] bg-[#ff9248]/10 blur-3xl"></div>
              <img
                src={AboutImage}
                alt="About Anand Vihar"
                className="relative rounded-[32px] shadow-large object-cover w-full h-[450px]"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="section-space py-24">
        <div className="section">
          <div className="grid gap-16 lg:grid-cols-2">
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge">Our Story</span>
              <h2 className="mt-6 subtitle text-4xl font-bold text-[#013e37]">
                A Journey Built on Purity, Trust & Tradition
              </h2>

              <p className="mt-8 description text-slate-600 leading-relaxed text-base">
                What began as a dedicated endeavor to revive authentic regional Indian sweets has today grown into Jhumri Telaiya’s most trusted destination for pure ghee sweets, festive dry fruits, and gourmet confectioneries. Our commitment has always been simple — pure ingredients, local heritage, and heartfelt service.
              </p>

              <p className="mt-6 description text-slate-600 leading-relaxed text-base">
                Every customer who walks into Anand Vihar Sweet Shop becomes part of our extended family. From weddings, baby showers, and regional festivals to daily sweet cravings — we take absolute pride in making your life's milestones sweeter.
              </p>
            </motion.div>

            <div className="grid gap-6">
              <div className="card bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <Award className="mb-5 text-[#ff9248]" size={42} />
                <h3 className="text-2xl font-bold text-[#013e37]">Premium Ingredients</h3>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                  We use only high-grade saffron, rich dry fruits, organic cardamom, and pure milk fats sourced from trusted dairy partners to maintain premium consistency.
                </p>
              </div>

              <div className="card bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <HeartHandshake className="mb-5 text-[#013e37]" size={42} />
                <h3 className="text-2xl font-bold text-[#013e37]">Generations of Trust</h3>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                  Decades of uncompromised taste have earned us a special place in the hearts of thousands of families across Jhumri Telaiya and Koderma.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="bg-[#FAF5EF] section-space py-24">
        <div className="section">
          <div className="text-center">
            <span className="badge">Our Purpose</span>
            <h2 className="mt-6 subtitle text-4xl font-bold text-[#013e37]">Mission & Vision</h2>
            <p className="mx-auto mt-6 max-w-3xl description text-slate-600 leading-relaxed">
              Every sweet we craft and every customer interaction is guided by our values of pure hygiene, authentic taste, and traditional heritage.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF4EB]">
                <ChefHat size={34} className="text-[#ff9248]" />
              </div>
              <h3 className="text-3xl font-bold text-[#013e37]">Our Mission</h3>
              <p className="mt-6 text-slate-500 leading-relaxed text-sm sm:text-base">
                To handcraft authentic Indian sweets using time-honored techniques, ensuring complete visual and physical quality checks. We aim to protect regional recipes and offer clean, wholesome treats that bring families together.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF8F4]">
                <Sparkles size={34} className="text-[#013e37]" />
              </div>
              <h3 className="text-3xl font-bold text-[#013e37]">Our Vision</h3>
              <p className="mt-6 text-slate-500 leading-relaxed text-sm sm:text-base">
                To expand our sweetcraft heritage globally as Jhumri Telaiya's premier confectionery brand, adopting modern packaging systems while preserving traditional handmade flavor standards.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="section-space py-24">
        <div className="section">
          <div className="text-center">
            <span className="badge">Why Choose Us</span>
            <h2 className="mt-6 subtitle text-4xl font-bold text-[#013e37]">
              Experience The Anand Vihar Difference
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="card bg-white text-center p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-5xl font-extrabold text-[#ff9248]">{item.number}</h3>
                <h4 className="mt-5 text-2xl font-bold text-[#013e37]">{item.title}</h4>
                <p className="mt-4 text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMPANY TIMELINE ================= */}
      <section className="bg-[#FAF5EF] section-space py-24">
        <div className="section">
          <div className="text-center">
            <span className="badge">Our Journey</span>
            <h2 className="mt-6 subtitle text-4xl font-bold text-[#013e37]">Milestones Through The Years</h2>
          </div>

          <div className="mt-20 space-y-8">
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
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="card bg-white flex flex-col gap-6 p-8 md:flex-row md:items-center rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="rounded-2xl bg-[#013e37] px-8 py-5 text-center text-white min-w-[120px]">
                  <h3 className="text-3xl font-bold">{item.year}</h3>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#013e37]">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY PREVIEW ================= */}
      <section className="section-space py-24">
        <div className="section">
          <div className="text-center">
            <span className="badge">Confectionery Gallery</span>
            <h2 className="mt-6 subtitle text-4xl font-bold text-[#013e37]">A Glimpse of Anand Vihar</h2>
            <p className="description mx-auto mt-6 text-slate-600 leading-relaxed">
              Every detail reflects our passion for pure sweets, premium aesthetics, and welcoming service.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[Gallery1, Gallery2, Gallery3].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="group overflow-hidden rounded-[28px] shadow-premium"
              >
                <img
                  src={image}
                  alt="Sweet Shop Gallery"
                  className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-24">
        <div className="section">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-[40px] bg-gradient-to-r from-[#013e37] to-[#045148] px-8 py-16 text-center text-white shadow-large md:px-16"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm select-none">
              Anand Vihar Sweet Shop
            </span>

            <h2 className="mt-8 text-4xl font-extrabold md:text-5xl text-white">
              Experience Pure Sweetness Today
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-base sm:text-lg leading-relaxed text-white/80">
              Whether you are ordering custom gift boxes for a wedding, celebrating a festival, or enjoying your favorite daily sweets, Anand Vihar promises pure ingredients and unforgettable traditional taste.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
              {settings?.reservationsEnabled && (
                <Link
                  to="/reservation"
                  className="rounded-full bg-[#ff9248] hover:bg-[#ea5a00] px-9 py-4 text-base sm:text-lg font-semibold transition hover:scale-105 text-white text-center cursor-pointer no-underline min-w-[150px]"
                >
                  Book A Table
                </Link>
              )}
              <Link
                to="/contact"
                className="rounded-full border-2 border-white hover:bg-white hover:text-[#013e37] px-9 py-4 text-base sm:text-lg font-semibold transition hover:scale-105 text-white text-center cursor-pointer no-underline min-w-[150px]"
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