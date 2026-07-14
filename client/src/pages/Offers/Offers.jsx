import { motion } from "framer-motion";
import {
  Sparkles,
  Gift,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { Link } from "react-router-dom";

import OfferHero from "../../assets/images/offers-banner.jpg";
import Offer1 from "../../assets/images/offer1.jpg";
import Offer2 from "../../assets/images/offer2.jpg";
import Offer3 from "../../assets/images/offer3.jpg";

function Offers() {

  const offers = [

    {
      id:1,
      title:"Diwali Special",
      discount:"25% OFF",
      description:"Celebrate festivals with our premium sweet boxes.",
      image:Offer1,
      color:"bg-[#ff9248]",
    },

    {
      id:2,
      title:"Family Combo",
      discount:"₹999",
      description:"Perfect dinner combo for 4 people.",
      image:Offer2,
      color:"bg-[#013e37]",
    },

    {
      id:3,
      title:"Buy 2 Get 1",
      discount:"FREE",
      description:"Applicable on selected sweet gift boxes.",
      image:Offer3,
      color:"bg-[#9a0002]",
    },

  ];

  return (

    <main className="bg-[#FDFCFA]">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-[#FAF5EF]">

        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#ff9248]/10 blur-[140px]" />

        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[#013e37]/10 blur-[150px]" />

        <div className="section py-24">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* LEFT */}

            <motion.div

              initial={{opacity:0,x:-60}}

              animate={{opacity:1,x:0}}

              transition={{duration:.8}}

            >

              <span className="badge">

                <Sparkles size={16}/>

                Exclusive Offers

              </span>

              <h1 className="mt-8 text-5xl font-extrabold leading-tight text-[#013e37] md:text-6xl">

                Save More With

                <span className="text-[#ff9248]">

                  {" "}Every Visit

                </span>

              </h1>

              <p className="mt-8 max-w-xl text-lg leading-9 text-slate-600">

                Discover exciting discounts, festival offers,
                family combos and exclusive membership benefits
                available only at Anand Vihar Restaurant & Sweet Shop.

              </p>

              <div className="mt-10 flex flex-wrap gap-5">

                <Link
                  to="/menu"
                  className="btn btn-primary"
                >

                  Explore Menu

                  <ArrowRight size={18}/>

                </Link>

                <Link
                  to="/reservation"
                  className="btn btn-secondary"
                >

                  <CalendarDays size={18}/>

                  Book Table

                </Link>

              </div>

            </motion.div>

            {/* RIGHT */}

            <motion.div

              initial={{opacity:0,x:60}}

              animate={{opacity:1,x:0}}

              transition={{duration:.8}}

              className="relative"

            >

              <div className="absolute inset-0 rounded-[40px] bg-[#ff9248]/10 blur-3xl"/>

              <img

                src={OfferHero}

                alt="Offers"

                className="relative rounded-[32px] shadow-large"

              />

            </motion.div>

          </div>

        </div>

      </section>

      {/* ================= OFFERS ================= */}

      <section className="section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Today's Best Deals

            </span>

            <h2 className="mt-6 subtitle">

              Special Offers Just For You

            </h2>

          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {offers.map((offer,index)=>(

              <motion.div

                key={offer.id}

                initial={{opacity:0,y:40}}

                whileInView={{opacity:1,y:0}}

                viewport={{once:true}}

                transition={{

                  duration:.6,

                  delay:index*.15

                }}

                className="group overflow-hidden rounded-[30px] bg-white shadow-large"

              >

                <div className="relative overflow-hidden">

                  <img

                    src={offer.image}

                    alt={offer.title}

                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"

                  />

                  <div className={`absolute left-5 top-5 rounded-full ${offer.color} px-5 py-2 text-sm font-bold text-white`}>

                    {offer.discount}

                  </div>

                </div>

                <div className="p-8">

                  <h3 className="text-3xl font-bold text-[#013e37]">

                    {offer.title}

                  </h3>

                  <p className="mt-5">

                    {offer.description}

                  </p>

                  <button className="mt-8 rounded-full bg-[#013e37] px-6 py-3 font-semibold text-white transition hover:bg-[#025347]">

                    Claim Offer

                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>
            {/* ================= COUPONS ================= */}

      <section className="bg-[#FAF5EF] section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              <Gift size={16} />

              Coupon Collection

            </span>

            <h2 className="mt-6 subtitle">

              Save Even More With Coupons

            </h2>

            <p className="description mx-auto mt-6">

              Use these exclusive coupons while placing your order
              and enjoy additional discounts on your favourite meals
              and sweets.

            </p>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {[
              {
                code: "WELCOME10",
                title: "₹100 OFF",
                desc: "Valid on first order above ₹999.",
                color: "bg-[#ff9248]",
              },
              {
                code: "FAMILY20",
                title: "20% OFF",
                desc: "Applicable on Family Combo Meals.",
                color: "bg-[#013e37]",
              },
              {
                code: "SWEET50",
                title: "₹50 OFF",
                desc: "On selected premium sweet boxes.",
                color: "bg-[#9a0002]",
              },
            ].map((coupon, index) => (

              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .1,
                }}
                className="relative overflow-hidden rounded-[30px] bg-white shadow-large"
              >

                <div className={`h-3 ${coupon.color}`}></div>

                <div className="p-8">

                  <span className="rounded-full bg-[#FFF4EB] px-4 py-2 text-sm font-bold text-[#ff9248]">

                    {coupon.code}

                  </span>

                  <h3 className="mt-6 text-4xl font-bold text-[#013e37]">

                    {coupon.title}

                  </h3>

                  <p className="mt-5">

                    {coupon.desc}

                  </p>

                  <button className="mt-8 rounded-full border-2 border-[#013e37] px-6 py-3 font-semibold text-[#013e37] transition hover:bg-[#013e37] hover:text-white">

                    Copy Coupon

                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= MEMBERSHIP ================= */}

      <section className="section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Premium Membership

            </span>

            <h2 className="mt-6 subtitle">

              Become A Gold Member

            </h2>

            <p className="description mx-auto mt-6">

              Join our loyalty program and enjoy exclusive discounts,
              birthday surprises, reward points and priority table
              reservations.

            </p>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="mt-16 overflow-hidden rounded-[36px] bg-gradient-to-r from-[#013e37] to-[#045148] p-10 text-white shadow-large"
          >

            <div className="grid items-center gap-10 lg:grid-cols-2">

              <div>

                <span className="inline-flex rounded-full bg-white/10 px-5 py-2">

                  Gold Membership

                </span>

                <h3 className="mt-8 text-5xl font-bold">

                  Unlock Premium Benefits

                </h3>

                <p className="mt-8 max-w-xl text-lg leading-9 text-white/80">

                  Earn reward points on every purchase,
                  receive exclusive festival offers,
                  complimentary birthday dessert,
                  anniversary discounts and much more.

                </p>

              </div>

              <div className="grid gap-5">

                {[
                  "5% Extra Discount",
                  "Birthday Special Dessert",
                  "Reward Points",
                  "Priority Table Booking",
                  "Exclusive Festival Coupons",
                  "Members Only Deals",
                ].map((benefit) => (

                  <div
                    key={benefit}
                    className="rounded-2xl bg-white/10 px-6 py-5 backdrop-blur-md"
                  >

                    <span className="text-lg font-medium">

                      ✓ {benefit}

                    </span>

                  </div>

                ))}

              </div>

            </div>

          </motion.div>

        </div>

      </section>
            {/* ================= FESTIVAL HIGHLIGHTS ================= */}

      <section className="bg-[#FAF5EF] section-space">

        <div className="section">

          <div className="text-center">

            <span className="badge">

              Festival Specials

            </span>

            <h2 className="mt-6 subtitle">

              Celebrate Every Occasion With Anand Vihar

            </h2>

            <p className="description mx-auto mt-6">

              Every festival deserves authentic sweets and delicious meals.
              Enjoy exclusive seasonal collections prepared with love.

            </p>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "Diwali",
                offer: "25% OFF",
                color: "#ff9248",
              },
              {
                title: "Holi",
                offer: "Free Sweet Box",
                color: "#013e37",
              },
              {
                title: "Raksha Bandhan",
                offer: "Special Gift Packs",
                color: "#9a0002",
              },
              {
                title: "Wedding Orders",
                offer: "Bulk Discounts",
                color: "#ff9248",
              },
            ].map((festival, index) => (

              <motion.div
                key={festival.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .1,
                }}
                className="card p-8 text-center"
              >

                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                  style={{
                    background: festival.color,
                  }}
                >

                  🎉

                </div>

                <h3 className="mt-6 text-2xl font-bold">

                  {festival.title}

                </h3>

                <p
                  className="mt-4 text-lg font-semibold"
                  style={{
                    color: festival.color,
                  }}
                >

                  {festival.offer}

                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="pb-24">

        <div className="section">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="overflow-hidden rounded-[40px] bg-gradient-to-r from-[#013e37] to-[#045148] px-10 py-16 text-center text-white shadow-large md:px-16"
          >

            <span className="inline-flex rounded-full bg-white/10 px-6 py-2">

              Limited Time Offers

            </span>

            <h2 className="mt-8 text-4xl text-stone-100 font-extrabold md:text-5xl">

              Don't Miss Today's Best Deals

            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/80">

              Whether you're planning a family dinner, ordering sweets for
              a celebration, or booking a party, our exclusive offers help
              you save more while enjoying the authentic taste of Anand Vihar.

            </p>

            <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">

              <Link
                to="/menu"
                className="rounded-full bg-[#ff9248] px-9 py-4 text-lg font-semibold transition hover:scale-105"
              >

                Order Now

              </Link>

              <Link
                to="/reservation"
                className="rounded-full border-2 border-white px-9 py-4 text-lg font-semibold transition hover:bg-white hover:text-[#013e37]"
              >

                Book A Table

              </Link>

            </div>

          </motion.div>

        </div>

      </section>

    </main>

  );

}

export default Offers;