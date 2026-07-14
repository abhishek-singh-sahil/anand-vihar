import { motion } from "framer-motion";
import { CalendarDays, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ReservationCTA() {
  return (
    <section className="relative overflow-hidden py-24">

      {/* Background */}

      <div className="absolute inset-0 orange-gradient"></div>

      <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#013e37]/20 blur-3xl"></div>

      <div className="section relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-center shadow-2xl md:p-14"
        >

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#ff9248] shadow-lg">
            <CalendarDays size={40} />
          </div>

          <span className="mt-8 inline-block rounded-full bg-[#ffefb3] px-5 py-2 font-semibold text-[#013e37]">
            Reserve Your Table
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-white lg:text-6xl">
            Enjoy Delicious Food
            <br />
            With Your Family
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/90">
            Reserve your table in advance and enjoy an unforgettable dining
            experience at Anand Vihar Restaurant & Sweet Shop. Fresh food,
            premium sweets and exceptional hospitality await you.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

            <Link
              to="/reservation"
              className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#ff9248] transition hover:scale-105"
            >
              Book Table
              <ArrowRight size={20} />
            </Link>

            <a
              href="tel:+919934190109"
              className="flex items-center gap-3 rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-[#013e37]"
            >
              <Phone size={20} />
              Call Now
            </a>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-3xl font-bold text-[#ffefb3]">
                25+
              </h3>
              <p className="mt-2 text-white">
                Years of Trust
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-3xl font-bold text-[#ffefb3]">
                10K+
              </h3>
              <p className="mt-2 text-white">
                Happy Customers
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-3xl font-bold text-[#ffefb3]">
                150+
              </h3>
              <p className="mt-2 text-white">
                Food & Sweet Items
              </p>
            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default ReservationCTA;