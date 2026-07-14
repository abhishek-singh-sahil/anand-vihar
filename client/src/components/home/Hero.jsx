import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Star,
  Gift,
  Award,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import HeroImage from "../../assets/images/hero-food.png";

const stats = [
  {
    icon: Award,
    value: "25+",
    title: "Years of Excellence",
    subtitle: "Serving happiness since 1998",
    color: "text-[#013e37]",
  },
  {
    icon: CalendarDays,
    value: "100+",
    title: "Delicious Dishes",
    subtitle: "Wide range of sweets & meals",
    color: "text-[#ff9248]",
  },
  {
    icon: Users,
    value: "10K+",
    title: "Happy Customers",
    subtitle: "Trusted by thousands of families",
    color: "text-[#013e37]",
  },
];

function Hero() {
  const { settings } = useAuth();

  return (
    <section className="relative overflow-hidden bg-[#FDFCFA]">
      {/* Background Blur */}
      <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#ff9248]/10 blur-[140px]" />
      <div className="absolute right-0 top-40 h-[450px] w-[450px] rounded-full bg-[#013e37]/10 blur-[160px]" />

      <div className="section relative z-10">
        <div className="grid items-center gap-10 py-12 md:py-16 lg:min-h-[88vh] lg:grid-cols-[46%_54%]">
          
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF1C9] px-5 py-2 shadow-sm">
              <Star size={14} className="fill-[#ffb300] text-[#ffb300]" />
              <span className="text-xs sm:text-sm font-semibold text-[#013e37]">Since 1998</span>
              <span className="text-[#013e37]/40">•</span>
              <span className="text-xs sm:text-sm font-semibold text-[#013e37]">Premium Taste</span>
            </div>

            {/* Heading (Improved mobile font responsiveness) */}
            <h1 className="mt-6 sm:mt-8 max-w-[650px] font-poppins text-4xl sm:text-5xl md:text-7xl xl:text-[84px] font-extrabold leading-[1.1] sm:leading-[1.05] text-[#013e37] tracking-tight">
              Taste the
              <br />
              <span className="text-[#ff9248]">Sweetness</span>
              <br />
              of Tradition
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-9 text-slate-600">
              Anand Vihar brings together authentic Indian sweets, delicious restaurant meals, and unforgettable flavours. Every bite is crafted with quality ingredients, traditional recipes, and years of trust.
            </p>

            {/* Tagline (Stylish script design) */}
            <p className="mt-6 text-xl sm:text-2xl md:text-3xl font-extrabold italic tracking-wide bg-gradient-to-r from-[#ff7b22] via-[#ea5a00] to-[#013e37] bg-clip-text text-transparent drop-shadow-sm font-serif">
              "Enjoyment hua band ? ...toh khao Kalakand!"
            </p>

            {/* Buttons (Responsive layout) */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/menu"
                className="group flex h-14 items-center justify-center gap-3 rounded-full bg-[#ff9248] px-8 text-base sm:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#ff7f22] cursor-pointer"
              >
                Explore Menu
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>

              {settings?.reservationsEnabled && (
                <Link
                  to="/reservation"
                  className="group flex h-14 items-center justify-center gap-3 rounded-full border-2 border-[#013e37] bg-white px-8 text-base sm:text-lg font-semibold text-[#013e37] transition-all duration-300 hover:bg-[#013e37] hover:text-white cursor-pointer"
                >
                  <CalendarDays size={18} />
                  Book Table
                </Link>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0"
          >
            {/* Glow Behind Image */}
            <div className="absolute h-[320px] w-[320px] sm:h-[500px] sm:w-[500px] rounded-full bg-[#ff9248]/10 blur-[100px]" />

            {/* Main Image */}
            <motion.img
              src={HeroImage}
              alt="Anand Vihar Special"
              className="relative z-10 w-full max-w-[320px] sm:max-w-[550px] lg:max-w-[760px] drop-shadow-[0_20px_40px_rgba(0,0,0,.15)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Rating Card (Hidden on mobile) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-[-10%] left-[10%] z-20 hidden lg:block w-[240px] rounded-[24px] bg-white px-5 py-5 shadow-xl border border-gray-50"
            >
              <div className="mb-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={16} className="fill-[#FDBA12] text-[#FDBA12]" />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <h3 className="text-xl font-bold leading-none text-[#013e37]">4.9</h3>
                <p className="text-sm font-medium text-[#013e37]">Customer Rating</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  <img src="https://i.pravatar.cc/32?img=12" className="h-7 w-7 rounded-full border border-white" alt="" />
                  <img src="https://i.pravatar.cc/32?img=13" className="h-7 w-7 rounded-full border border-white" alt="" />
                  <img src="https://i.pravatar.cc/32?img=14" className="h-7 w-7 rounded-full border border-white" alt="" />
                </div>
                <span className="text-xs text-slate-500">2K+ Reviews</span>
              </div>
            </motion.div>

            {/* Small Green Offer Card (Hidden on mobile) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-[8%] bottom-16 z-20 hidden lg:block rounded-[20px] bg-[#012b26] px-4 py-4 text-center text-white shadow-xl"
            >
              <Gift size={16} className="mx-auto mb-1.5" />
              <p className="text-[11px] font-medium leading-5 tracking-wide text-white">
                Everyday<br />Special<br />
                <span className="font-bold text-xs">OFFER</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-20 mt-4 mb-10 rounded-[28px] border border-[#efe6dd] bg-white/90 p-6 shadow-lg backdrop-blur-md"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${
                    index !== 2 ? "border-b pb-6 md:border-b-0 md:border-r md:pb-0" : ""
                  } border-[#efe6dd]`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4eb] shrink-0">
                    <Icon size={24} className={item.color} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${item.color}`}>{item.value}</h3>
                    <p className="text-sm font-semibold text-[#013e37]">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;