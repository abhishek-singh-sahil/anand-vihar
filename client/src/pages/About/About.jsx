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

import AboutImage from "../../assets/images/about.jpg";

function About() {
  return (
    <main className="bg-[#FDFCFA]">

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
              transition={{ duration: .8 }}
            >

              <div className="badge">

                <Sparkles size={16} />

                About Anand Vihar

              </div>

              <h1 className="mt-8 text-5xl font-extrabold leading-tight text-[#013e37] md:text-6xl">

                Crafting

                <span className="text-[#ff9248]">

                  {" "}Sweet Memories

                </span>

                <br />

                Since 1998

              </h1>

              <p className="mt-8 max-w-xl text-lg leading-9 text-slate-600">

                Anand Vihar Restaurant & Sweet Shop has been serving
                authentic Indian sweets, delicious meals and unforgettable
                hospitality for over two decades. Every recipe carries the
                flavour of tradition blended with modern quality standards.

              </p>

              <Link
                to="/menu"
                className="mt-10 inline-flex items-center gap-3 rounded-full orange-gradient px-8 py-4 text-lg font-semibold text-white shadow-premium hover-up"
              >

                Explore Menu

                <ArrowRight size={20} />

              </Link>

            </motion.div>

            {/* RIGHT */}

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .8 }}
              className="relative"
            >

              <div className="absolute inset-0 rounded-[40px] bg-[#ff9248]/10 blur-3xl"></div>

              <img
                src={AboutImage}
                alt="About Anand Vihar"
                className="relative rounded-[32px] shadow-large"
              />

            </motion.div>

          </div>

        </div>

      </section>

      {/* ================= OUR STORY ================= */}

      <section className="section-space">

        <div className="section">

          <div className="grid gap-16 lg:grid-cols-2">

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >

              <span className="badge">

                Our Story

              </span>

              <h2 className="mt-6 subtitle">

                A Journey Built on Taste,
                Trust & Tradition

              </h2>

              <p className="mt-8 description">

                What started as a small sweet shop has today become one of
                the most loved destinations for authentic Indian sweets and
                restaurant dining. Our commitment has always been simple —
                fresh ingredients, traditional recipes and heartfelt service.

              </p>

              <p className="mt-6 description">

                Every customer who walks into Anand Vihar becomes part of
                our extended family. Festivals, celebrations, weddings or
                everyday cravings — we make every moment sweeter.

              </p>

            </motion.div>

            <div className="grid gap-6">

              <div className="card p-8">

                <Award className="mb-5 text-[#ff9248]" size={42} />

                <h3 className="text-2xl font-bold">

                  Premium Quality

                </h3>

                <p className="mt-4">

                  Finest ingredients sourced with uncompromising quality.

                </p>

              </div>

              <div className="card p-8">

                <HeartHandshake
                  className="mb-5 text-[#013e37]"
                  size={42}
                />

                <h3 className="text-2xl font-bold">

                  Trusted by Families

                </h3>

                <p className="mt-4">

                  Thousands of happy customers have trusted us for decades.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
            {/* ================= MISSION & VISION ================= */}

      <section className="bg-[#FAF5EF] section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Our Purpose

            </span>

            <h2 className="mt-6 subtitle">

              Mission & Vision

            </h2>

            <p className="mx-auto mt-6 max-w-3xl description">

              Every meal, every sweet and every customer experience is driven
              by our passion for quality, authenticity and hospitality.

            </p>

          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">

            {/* Mission */}

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .6 }}
              className="card p-10"
            >

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF4EB]">

                <ChefHat
                  size={34}
                  className="text-[#ff9248]"
                />

              </div>

              <h3 className="text-3xl font-bold">

                Our Mission

              </h3>

              <p className="mt-6">

                To deliver authentic Indian flavours while maintaining
                exceptional quality, hygiene and customer satisfaction.
                We believe food should create memories that families cherish
                for generations.

              </p>

            </motion.div>

            {/* Vision */}

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .8 }}
              className="card p-10"
            >

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF8F4]">

                <Sparkles
                  size={34}
                  className="text-[#013e37]"
                />

              </div>

              <h3 className="text-3xl font-bold">

                Our Vision

              </h3>

              <p className="mt-6">

                To become the most trusted destination for sweets and
                restaurant dining by combining tradition, innovation,
                technology and world-class customer service.

              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Why Choose Us

            </span>

            <h2 className="mt-6 subtitle">

              Experience The Anand Vihar Difference

            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                number: "25+",
                title: "Years of Excellence",
                desc: "Serving families since 1998.",
              },
              {
                number: "100+",
                title: "Delicious Dishes",
                desc: "Traditional sweets & restaurant meals.",
              },
              {
                number: "10K+",
                title: "Happy Customers",
                desc: "Loved by thousands of families.",
              },
              {
                number: "365",
                title: "Fresh Everyday",
                desc: "Prepared fresh with premium ingredients.",
              },
            ].map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .1,
                }}
                className="card text-center p-8"
              >

                <h3 className="text-5xl font-extrabold text-[#ff9248]">

                  {item.number}

                </h3>

                <h4 className="mt-5 text-2xl font-bold">

                  {item.title}

                </h4>

                <p className="mt-4">

                  {item.desc}

                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= COMPANY TIMELINE ================= */}

      <section className="bg-[#FAF5EF] section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Our Journey

            </span>

            <h2 className="mt-6 subtitle">

              Milestones Through The Years

            </h2>

          </div>

          <div className="mt-20 space-y-10">

            {[
              {
                year: "1998",
                title: "Restaurant Founded",
                desc: "Started as a small sweet shop with a passion for authentic Indian sweets.",
              },
              {
                year: "2008",
                title: "Restaurant Expansion",
                desc: "Expanded into full-service restaurant with diverse menu offerings.",
              },
              {
                year: "2018",
                title: "Trusted Local Brand",
                desc: "Recognized as one of the region's most loved family restaurants.",
              },
              {
                year: "2026",
                title: "Digital Transformation",
                desc: "Launching complete online ordering & management system.",
              },
            ].map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .6,
                  delay: index * .1,
                }}
                className="card flex flex-col gap-6 p-8 md:flex-row md:items-center"
              >

                <div className="rounded-2xl bg-[#013e37] px-8 py-5 text-center text-white">

                  <h3 className="text-3xl font-bold">

                    {item.year}

                  </h3>

                </div>

                <div>

                  <h3 className="text-2xl font-bold">

                    {item.title}

                  </h3>

                  <p className="mt-3">

                    {item.desc}

                  </p>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= GALLERY PREVIEW ================= */}

      <section className="section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Restaurant Gallery

            </span>

            <h2 className="mt-6 subtitle">

              A Glimpse Of Anand Vihar

            </h2>

            <p className="description mx-auto mt-6">

              Every corner reflects our passion for authentic food,
              premium ambience and memorable family experiences.

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
                  duration: .6,
                  delay: index * .15,
                }}
                className="group overflow-hidden rounded-[28px] shadow-premium"
              >

                <img
                  src={image}
                  alt="Restaurant Gallery"
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
            transition={{ duration: .8 }}
            className="overflow-hidden rounded-[40px] bg-gradient-to-r from-[#013e37] to-[#045148] px-8 py-16 text-center text-white shadow-large md:px-16"
          >

            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm">

              Anand Vihar Restaurant & Sweet Shop

            </span>

            <h2 className="mt-8 text-4xl text-stone-200 font-extrabold md:text-5xl">

              Experience Authentic Taste Like Never Before

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/80">

              Whether it's a family dinner, a festive celebration,
              a wedding order or your favourite sweets,
              Anand Vihar promises quality, tradition and unforgettable flavours.

            </p>

            <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">

              <Link
                to="/reservation"
                className="rounded-full bg-[#ff9248] px-9 py-4 text-lg font-semibold transition hover:scale-105"
              >

                Book A Table

              </Link>

              <Link
                to="/contact"
                className="rounded-full border-2 border-white px-9 py-4 text-lg font-semibold transition hover:bg-white hover:text-[#013e37]"
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